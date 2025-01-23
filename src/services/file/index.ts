/**
 * Copyright 2024 Maner·Fan
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import type { Response } from '@/services/typings';
import { request } from '@umijs/max';
import { FILE } from './typings';

/**
 * 上传文件
 */
export async function upload(
  file: File,
): Promise<Response.SingleResponse<FILE.SimpleFile>> {
  const formData = new FormData();
  formData.append('file', file);
  
  return request('/api/file/upload', {
    method: 'POST',
    data: formData,
    requestType: 'form',
  });
}
