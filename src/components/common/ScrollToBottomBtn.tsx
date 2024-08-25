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

import { Button } from 'antd';
import { ArrowDownToLine } from 'lucide-react';
import React, { forwardRef, useImperativeHandle } from 'react';
import { useScrollToBottom, useSticky } from 'react-scroll-to-bottom';

export interface ScrollToBottomBtnRefProperty {
  trigScrollToBottom: () => void;
}

const ScrollToBottomBtn: React.FC<{ className?: string }> = forwardRef(({ className }, ref) => {
  const scrollToBottom = useScrollToBottom();
  const [sticky] = useSticky();

  useImperativeHandle(ref, () => ({
    trigScrollToBottom() {
      scrollToBottom({ behavior: 'smooth' });
      console.log('scroll to bottom');
    },
  }));

  // 如果 sticky 为 false，显示滚动按钮
  return (
    <>
      {!sticky && (
        <Button
          size="small"
          type="primary"
          shape="circle"
          onClick={() => scrollToBottom({ behavior: 'smooth' })}
          icon={<ArrowDownToLine size={18} />}
          className={`absolute bottom-1 right-4 z-50 ${className}`}
        />
      )}
    </>
  );
});

export default ScrollToBottomBtn;
