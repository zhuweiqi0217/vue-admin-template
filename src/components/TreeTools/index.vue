<!-- eslint-disable vue/require-prop-types -->
<template>
  <el-row class="tree-item">
    <el-col :span="12">
      <!-- 左侧内容 -->
      <span>{{ treeNode.name }}</span>
    </el-col>
    <el-col :span="12">
      <!-- 右侧内容 -->
      <el-row type="flex" justify="end">
        <span class="manage-text">{{ treeNode.manager }}</span>
        <!-- 放置下拉菜单  command: 指令的意思 -->
        <el-dropdown @command="operateDepts">
          <!-- 内容 -->
          <span class="el-dropdown-link">操作
            <i class="el-icon-arrow-down" />
          </span>
          <!-- 具名插槽 -->
          <el-dropdown-menu slot="dropdown">
            <!-- 下拉选项 -->
            <el-dropdown-item command="add">添加子部门</el-dropdown-item>
            <el-dropdown-item v-if="!isRoot" command="edit">编辑子部门</el-dropdown-item>
            <el-dropdown-item v-if="!isRoot" command="del">删除子部门</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
// 删除部门接口方法
import { delDepartments } from '@/api/depts'
// 新增部门接口
// import { addDepartments } from '@/api/depts'
export default {
  name: 'TreeTools',
  props: {
    treeNode: { // 当前节点数据(部门名称和负责人信息)
      type: Object,
      default: () => {}
    },
    isRoot: {
      type: Boolean,
      default: false // 表示当前这个节点是不是根节点
    },
    deptId: {
      type: [String, Number],
      default: '' // 默认值生效(有用了)
    }
  },
  methods: {
    // 点击 编辑 删除 新增时触发 通过自定义事件通知父组件执行
    operateDepts(type) {
      if (type === 'add') {
        // 新增子部门
        // 告诉父组件 显示弹层
        this.$emit('add-depts', this.treeNode.id) // 为何传出treeNode 因为是添加子部门 需要当前部门的数据
      } else if (type === 'edit') {
        // 编辑部门
        this.$emit('edit-depts', this.treeNode.id)
      } else {
        // 删除部门
        this.$confirm('您确定删除该部门么!').then(() => {
          return delDepartments(this.treeNode.id)
        }).then(() => {
          // 只需要等到成功的时候 调用接口删除了 后端数据变化了 但是前端没变 重新获取刷新
          this.$emit('del-depts') // 触发自定义事件传递给父组件
          this.$message.success('删除部门成功')
        })
      }
      // 优化(优化之前需要将删除部门的方法转移到add-dept里面去)
      // this.$emit(`${type}-depts`, this.treeNode.id)

      // 一般判断逻辑超过两个,推荐用 switch
      // switch (command) {
      //   case 'add':
      //     break
      //   case 'edit':
      //     break
      //   case 'del':
      //     break
      // }
    }
  }
}
</script>

<style lang="scss" scoped>
 .manage-text{
    margin-right: 20px;
  }
  .tree-item{
    width: 100%;
  }
</style>

