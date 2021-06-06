export default function LocalData () {
  this.value = ''//显示的值  ||附件时候表示 路径，文件名
  this.display = ''//上传的值 ||附件时候表示上传的附件id

  this.name = ''
  this.obj = {}//选项对象
  this.isSelected = false//是否被选中，用于多选
}
