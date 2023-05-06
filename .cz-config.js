const types = {
  feat: '用于向项目中添加新的功能或功能模块',
  fix: '用于修复Bug或解决其他问题',
  perf: '用于对代码进行性能优化，如算法改进、资源利用优化等',
  refactor: '对代码重构，提高代码质量和可维护性，不涉及功能修改',
  chore: '构建系统、任务管理、辅助工具配置等与构建过程或开发流程相关的变更',
  docs: '用于修改或添加文档内容，如README、API文档等',
  style: '用于修改代码格式、空格、缩进等不涉及代码逻辑的变更',
  revert: '代码回滚,用于撤销之前的提交',
  build: '变更项目构建或外部依赖',
  test: '测试变更，用于添加、修改或修复测试代码',
  wip: '进行中的工作',
}

const typeList = Object.keys(types).map((key) => {
  const pad = ' '.repeat(12 - key.length)
  types[key] = `${pad}${types[key]}`
  return {
    value: key,
    name: `${key}: ${types[key]}`,
  }
})

module.exports = {
  types: typeList,
  // scopes: [{ name: 'player' }, { name: 'doc' }],
  // usePreparedCommit: false, // to re-use commit from ./.git/COMMIT_EDITMSG
  allowTicketNumber: false,
  isTicketNumberRequired: false,
  ticketNumberPrefix: 'TICKET-',
  ticketNumberRegExp: '\\d{1,5}',

  // it needs to match the value for field type. Eg.: 'fix'
  // scopeOverrides: {
  //   fix: [{ name: 'merge' }, { name: 'style' }],
  // },

  // override the messages, defaults are as follows
  messages: {
    type: '选择一种你的提交类型:',
    scope: '选择一个scope (可选):',
    customScope: 'Denote the SCOPE of this change:', // used if allowCustomScopes is true
    subject: '简短说明(最多40个字):',
    body: '长说明，使用"|"换行(可选):\n',
    breaking: '非兼容性说明 (可选):\n',
    footer: '关联的issue,例如:#12,#34(可选,无可直接回车):',
    confirmCommit: '确定提交说明?',
  },

  allowCustomScopes: true,
  allowBreakingChanges: ['feat', 'fix'],
  subjectLimit: 100, // limit subject length
  breaklineChar: '|', // It is supported for fields body and footer.
  footerPrefix: 'ISSUES CLOSED:',
  askForBreakingChangeFirst: true, // default is false

  // 跳过你想要填写的问题
  skipQuestions: ['scope', 'body', 'breaking', 'footer'],
}

// 为什么使用规范的提交: https://www.conventionalcommits.org/en/v1.0.0/#summary
// 示例：https://github.com/leoforfree/cz-customizable/blob/master/cz-config-EXAMPLE.js
