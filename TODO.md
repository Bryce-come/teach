
账号：
admin，666666
teacher1, 123456
student1, 123456

-[ ] 操作台管理，添加设备，其中添加网关编号时，限制必须输入15位字符（正则校验：大写和数字）。
-[ ] 实时监控页：增加时间倒计时。
-[ ] 课程管理中，填写分数比的时候，需要核验是否100%。
-[ ] 报告模板管理：操作中的按钮并排放
-[ ] 所有的table expand中的el-form-item margin-bottom都改小点。
-[ ] 学生管理中，缺少修改班级名。
-[ ] 学生管理中，新增班级名、修改班级名、新增小组名、修改小组名，都是类似的，用一个dialog，同时注意ref='form' 重复了，每个dialog在提交时都必须对form validate()，不用手动去判断是否有无填写。
-[ ] 学生管理中，变量初始化时不要用 ''，如addClazFlag.addClazInfo，要用null。其他页面也是如此。
-[ ] 学生管理中，班级名称重复和分组重复都放在服务端校验了，前端的删除，所以grpandclzList也不需要了。并测试下。
-[ ] el-form-item 中的rules用于validate，是根据prop的值来校验的（在配置el-form的:model），这个都没注意
-[ ] 学生管理中，选择完班级或分组后，tree中那条背景色更改下，可以通过clasz.value或claszGroup.value来判断是否选中。同理，冻结也可以如此判断，修改底色。
-[ ] yarn lint 中的警告所示的内容修改。
