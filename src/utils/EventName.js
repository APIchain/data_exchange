/*
  Copyright 2017~2022 The Bottos Authors
  This file is part of the Bottos Data Exchange Client
  Created by Developers Team of Bottos.

  This program is free software: you can distribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with Bottos. If not, see <http://www.gnu.org/licenses/>.
*/
const ipcEventName = {
    get_key_store:'get-key-store',
    get_key_store_reply:'get-key-store-reply',
    save_key_store:'save-key-store',
    import_file:'import-file',
    import_file_reply:'import-file-reply',
    key_store_list:'key-store-list',
    export_key_store:'export_key_store',
    mkdir:'mkdir',
    file_download:'file_download',
    delete_download_cache:'delete_download_cache',
}

module.exports = {
    ipcEventName
}
