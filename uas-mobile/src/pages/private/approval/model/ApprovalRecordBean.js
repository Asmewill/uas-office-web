export default function ApprovalRecordBean() {
    this.isForknode = false;
    this.id = 0;
    this.nodeId = 0;
    this.title = "";
    this.chcheNode = "";
    this.imid = "";
    this.status = "";
    this.currentNodeMan = "";//当前节点的人员编号
    this.nodeName = "";
    this.needInputKeys = "";
    this.showNeedMessage = "";//保存必填字段时候，，没有填写时候提示信息
    this.processInstanceId = "";
    this.caller = "";
    this.callerName = "";


    this.getCallerName = function () {
        return this.callerName.replace('流程', '')
    }
}