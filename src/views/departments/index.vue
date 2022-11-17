<!-- eslint-disable vue/no-template-shadow -->
<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 组织架构内容 - 头部 -->
      <el-card class="tree-card">
        <!-- 放置结构内容 -->
        <!-- 使用tree组件
             data属性: 用来指定tree组件的数据源,一般是一个数组
             props: 是配置信息列表
             label: 指定节点标签为节点对象的某个属性值
             children: 指定子树为节点对象的某个属性值
        -->
        <tree-tools :tree-node="{ name: companyInfo.name,manager:companyInfo.manager }" is-root @add-depts="addDepts" />
        <hr>
        <el-tree v-loading="isLoading" :data="departs" :props="defaultProps" default-expand-all node-key="id">
          <!-- 使用作用域插槽,自定义tree节点的内容 -->
          <!-- 作用域插槽拿到的数据: node 表示节点的node对象 data 表示当前节点的数据 -->
          <template v-slot="{ data }">
            <tree-tools :tree-node="data" @del-depts="loadDeptsList" @add-depts="addDepts" @edit-depts="editDepts" />
          </template>
        </el-tree>
      </el-card>
    </div>
    <!-- 放置新增弹出层组件-添加部门 -->
    <AddDept ref="addDept" :show-dialog.sync="showDialog" :dept-id="deptId" @update-list="updateList" />
  </div>
</template>

<script>
import TreeTools from '@/components/TreeTools'
import AddDept from '@/views/departments/add-dept.vue'
import { getDepartments } from '@/api/depts'
import { list2Tree } from '@/utils'
export default {
  name: 'Department',
  components: { TreeTools, AddDept },
  data() {
    return {
      // data	展示数据
      departs: [],
      defaultProps: {
        children: 'children',
        // label	指定节点标签为节点对象的某个属性值
        label: 'name'
        // children	指定子树为节点对象的某个属性值
      },
      showDialog: false, // 默认不显示弹出层
      deptId: null, // 记录当前点击的节点
      companyInfo: {
        name: '',
        manager: '负责人'
      },
      // 默认加载效果(就是页面一打开转圈圈的样子)
      isLoading: true
    }
  },
  mounted() {
    this.loadDeptsList()
  },
  methods: {
    async loadDeptsList() {
      const res = await getDepartments()
      // console.log(res, this)
      this.companyInfo.name = res.companyName
      // 转成树形结构
      this.departs = list2Tree(res.depts, '')
      // 结构转换完成,结束加载效果
      this.isLoading = false
    },
    // 监听 tree-tools 中触发的点击添加子部门的事件
    // node 是我们点击的部门
    addDepts(deptId) {
      this.showDialog = true // 显示弹层
      this.deptId = deptId
    },
    updateList() {
      // this.showDialog = false
      this.loadDeptsList()
    },
    async editDepts(id) {
      // 应该在这里调用获取部门详情的方法(先获取再弹出弹层)
      // console.log(this.$refs.addDept)
      await this.$refs.addDept.onEdit(id)
      this.showDialog = true // 显示弹层
    }
  }
}
</script>

<style lang="scss" scoped>
.tree-card {
  padding: 30px 120px;
  font-size: 14px;

  .manage-text {
    margin-right: 20px;
  }

  .tree-item {
    width: 100%;
  }
}
</style>
