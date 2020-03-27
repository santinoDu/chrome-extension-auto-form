# chrome-extension-auto-form
A chrome extension that can remember forms in current page。

**Auto Form** 是一个可以记录当前页面表单信息的chrome扩展，可用于各个登录页，记录账号和密码之后，下次则无需再次输入。也可在大量表单测试过程中使用，防止重复输入，节约时间。

### 使用指引
- 下载压缩包解压或项目
- chrome打开扩展地址chrome://extensions/，打开右上角开发者模式，点击左侧[加载已解压的扩展程序]按钮，选择第一步项目目录。
- 打开需要记忆的表单页面，输入完表单之后点击右上角chrome扩展图片会出添加弹框，点击[记住该页面表单内容]按钮记录完成表单记录。该步骤可多次操作添加多个页面记忆。
- 每行有四项内容，分别为favicon，title，url，删除按钮，其中title内容可编辑，可自行添加备注内容。
- 在任意标签下点击favicon或链接均可跳转记录页面地址，然后填充表单内容。 或在存储页面底部会多出一个[填充当前页面记录表单]按钮，点击该按钮，会填充该页面记录表单。

### 支持表单情况
- 支持input
  >**注意:** 目前type为button，submit不支持，hidden由于有些页面会存token也不支持。
- 支持textarea
- 支持select。

### 后续可能改进计划
目前默认selector为:
  ```'input:not([type="submit"]):not([type="hidden"]):not([type="button"]), textarea, select'```
  后续可能会将这个值作为高级设置暴露出来给用户自定义。
  