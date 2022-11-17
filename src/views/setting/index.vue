<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-tabs v-model="activeName" type="border-card" @tab-click="handleTabToggle">
        <el-tab-pane label="用户管理" name="role">
          <el-row>
            <el-button
              icon="el-icon-plus"
              size="small"
              type="primary"
            >新增角色</el-button>
          </el-row>

          <!-- 表格 -->
          <el-table :data="roleList" border="">
            <el-table-column label="序号" width="100" type="index" />
            <el-table-column label="角色名称" width="200" prop="name" />
            <el-table-column label="描述" prop="description" />
            <el-table-column label="操作">
              <template v-slot="{ row }">
                <el-button size="small" type="success">分配权限</el-button>
                <el-button size="small" type="primary">编辑</el-button>
                <el-button size="small" type="danger" @click="onDelRole(row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>

          <!-- 分页区域 -->
          <!--
            size-change 和 current-change 事件
            来处理页码大小和当前页变动时候触发的事件
            total 表示总数
            current-page 表示当前显示第几页
           -->
          <el-pagination
            :current-page="pageInfo.pageno"
            :page-sizes="[2, 5, 10, 20]"
            :page-size="pageInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </el-tab-pane>
        <el-tab-pane label="配置管理" name="company">
          <el-alert
            title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
            type="info"
            show-icon
            :closable="false"
          />

          <el-form label-width="120px">
            <el-form-item label="公司名称:">
              <el-input v-model="companyInfo.name" disabled />
            </el-form-item>
            <el-form-item label="公司地址:">
              <el-input v-model="companyInfo.companyAddress" disabled />
            </el-form-item>
            <el-form-item label="公司邮箱:">
              <el-input v-model="companyInfo.mailbox" disabled />
            </el-form-item>
            <el-form-item label="备注:">
              <el-input v-model="companyInfo.remarks" class="remark" type="textarea" disabled />
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { getRoleList, getCompanyInfo, deleteRole } from '@/api/role'
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      activeName: 'role',
      pageInfo: {
        pageno: 1, // 当前显示第几页,默认第一页
        pagesize: 2 // 当前每页显示多少条,默认每页显示 2 条
      },
      total: 0,
      roleList: [],
      companyInfo: {}
    }
  },
  computed: {
    ...mapGetters(['companyId'])
  },
  mounted() {
    this.loadList()
  },
  methods: {
    async loadList() {
      const { rows, total } = await getRoleList(this.pageInfo)
      this.roleList = rows
      this.total = total
    },

    handleSizeChange(newSize) {
      // console.log('newSize', newSize)
      this.pageInfo.pagesize = newSize
      this.loadList()
    },
    handleCurrentChange(newPage) {
      // console.log('newPage', newPage)
      this.pageInfo.page = newPage
      this.loadList()
    },
    handleTabToggle() {
      if (this.activeName === 'company') {
        // 获取公司信息 !{} -> false  需求
        if (!Object.keys(this.companyInfo).length) {
          this.loadCompanyInfo()
        }
      }
    },
    async loadCompanyInfo() {
      this.companyInfo = await getCompanyInfo(this.companyId)
    },
    async onDelRole(roleId) {
      // 删除角色的接口
      try {
        await this.$confirm('您确定要删除该角色么?')
        await deleteRole(roleId)

        // 提示人家删除成功  列表要更新
        this.$message.success('角色删除成功')

        // 考虑细节: 当删除的列表只剩一条数据的时候,重新刷新列表的时候需要将 page - 1
        if (this.roleList.length === 1) {
          this.pageInfo.page >= 2 ? this.pageInfo.page - 1 : this.pageInfo.page = 1
        }
        this.loadList()
      } catch (error) {
        this.$message.info('您取消了删除')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-row {
    margin-bottom: 20px;
  }
  .el-pagination {
    margin-top: 20px;
    text-align: center;
  }
  .el-form{
    margin-top: 40px;
    .el-input, .remark{
      width: 500px;
    }
  }
</style>
