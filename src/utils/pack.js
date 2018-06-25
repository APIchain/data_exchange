'use strict'
import BTPack from './msgpack'
import BTCrypto from 'bottos-crypto-js'
import { getSignaturedFetchParam } from './BTCommonApi'
import BTFetch from './BTFetch'
const querystring = require('querystring');
const config = require('./config');
console.log('config', config);
// console.log('BTPack', BTPack);
// console.log('BTCrypto', BTCrypto);

const basicType = ['string', 'uint8', 'uint16', 'uint32', 'uint64']

function packByType(type, value) {
  switch (type) {
    case 'string':
      return BTPack.PackStr16(value)
    case 'uint8':
      return BTPack.PackUint8(value)
    case 'uint16':
      return BTPack.PackUint16(value)
    case 'uint32':
      return BTPack.PackUint32(value)
    case 'uint64':
      return BTPack.PackUint64(value)
    default:
      return console.error('Invalid type', type);
  }
}

/**
 * if the type is the basic type
 * return true
 * otherwise return false
 * @param  {String}  type data type
 * @return {Boolean}
 */
function isBasicType(type) {
  return basicType.includes(type)
}

/**
 * get .abi file content
 * @param  {String} contract contract
 * @return {Promise} Promise
 */
function getABI(contract) {
  let param = {
    service: 'bottos',
    method: 'CoreApi.QueryAbi',
    request: JSON.stringify({contract})
  }
  return fetch(config.service.base_url + 'rpc?' + querystring.stringify(param), {
    method: 'POST',
    headers: {
      contentType: 'application/x-www-form-urlencoded'
    }
  }).then(res => res.json()).then(res => {
    console.log('QueryAbi res', res);
    if (res.errcode == 0) {
      let abi = JSON.parse(res.result)
      console.log('result', abi);
      return abi;
    } else {
      console.error('error msg', res.msg);
      return null
    }
  })
  return fetch(`/bottosabi/${contract}.abi`).then(res => res.json())
}

getABI('nodeclustermng')

function findFieldsFromStructsByName(structs, name) {
  return structs.find(strc => strc.name == name).fields
}

function parseFields(fields, did, structs) {

  var array = [];

  const keys = Object.keys(fields)

  array = array.concat(BTPack.PackArraySize(keys.length))

  console.log('array', array);

  for (let key of keys) {
    let type = fields[key]

    if (isBasicType(type)) {
      // 是基础类型，直接 pack
      // packByType(type, value)
      let value = did[key]
      if (value == undefined) {
        return console.error('type error: expected type ' + key + ', but not found.', did)
      }

      array = array.concat( packByType(type, value) )
    } else {

      let fields2 = findFieldsFromStructsByName(structs, type)

      let did2 = did[key] || did.basic_info

      // console.log('fields2, did2', fields2, did2);

      let childArr = parseFields(fields2, did2, structs)
      // console.log('childArr', childArr);
      array = array.concat( childArr )
    }

  }

  return array;

}

export function packDID(did, contract, method) {
  // console.log('did, contract, method', did, contract, method);
  return getABI(contract).then(res => {
    if (res == null) {
      return ;
    }
    // console.log('res', res);
    const { actions, structs } = res
    // console.log('actions', actions);
    console.log('structs', structs);
    let name = actions.find(act => act.action_name == method).type
    let fields = findFieldsFromStructsByName(structs, name)
    // console.log('fields', fields);

    return parseFields(fields, did, structs);
  })
}

export function packedParam(did, fetchParam, privateKey) {
  const { contract, method } = fetchParam
  fetchParam.param = packDID(did, contract, method)
  return getSignaturedFetchParam({fetchParam, privateKey})
}
