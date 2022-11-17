<template>
  <!-- 放在弹出层组件 -->
  <el-dialog :title="`${showTitle}子部门`" :visible="showDialog" width="50%" :before-close="onClose" @closed="onClose">
    <!-- 表单数据 label-width 设置所有标题的宽度 -->
    <el-form ref="deptFormRef" label-width="120px" :model="formData" :rules="rules">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="formData.name" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="formData.code" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select v-model="formData.manager" style="width:80%" placeholder="请选择" @focus="onFocus">
          <!-- label 指定的属性是给用户看到的
             value 是用户选择这个 option 之后,会自动将 value 所绑定的值给 formData.manager 同步
        -->
          <!-- 这里的可选项应该是由接口提供的 -->
          <el-option v-for="simple in simpleList" :key="simple.id" :label="simple.username" :value="simple.username" />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input v-model="formData.introduce" style="width:80%" placeholder="1-300个字符" type="textarea" :rows="3" />
      </el-form-item>
    </el-form>
    <!-- 确定和消息 -->
    <!-- <template v-slot:footer> -->
    <template #footer>
      <el-button size="small" type="info" @click="onClose">取消</el-button>
      <el-button size="small" type="primary" @click="onConfirm">确定</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { getSimpleList, getDepartments, addDepartments, getDepartDetail, updateDepartments } from '@/api/depts'
export default {
  // 需要传入一个props变量来控制 显示或者隐藏
  props: {
    //   用来控制窗体是否显示或者隐藏
    showDialog: {
      type: Boolean,
      default: false
    },
    // 当前操作的节点
    deptId: {
      type: [String, Number],
      default: '' // 默认值生效(有用了)
    }
  },
  data() {
    const checkDeptName = async(rule, value, cb) => {
      // 需求: 同级部门禁止出现重复部门

      const { depts } = await getDepartments()
      console.log(depts, this.deptId)
      // 拿着 depts 去找(根据 this.deptId 去找所有子部门 -> 里面的名称应该不能和 value 重名)    找同事
      let isRepeat
      // 添加和修改的校验规则不一样
      if (this.formData.id) {
        // 修改的校验规则(需要剔除自己)
        // 不能用 this.deptId 是因为一打开编辑是没有传deptId进去
        isRepeat = depts.filter(dept => this.formData.pid === dept.pid && this.formData.id !== dept.id).some(item => item.name === value)
      } else {
        // 添加的校验
        isRepeat = depts.filter(dept => this.deptId === dept.pid).some(item => item.name === value)
      }
      isRepeat ? cb(new Error(`同级部门下已经存在${value}部门了`)) : cb()

      // value 不能和同级别的一致(推导出: 两个部门的 pid 是一致的)
    }

    const checkDeptCode = async(rule, value, cb) => {
      // 需求: 部门编码在整个模块都不允许重复
      const { depts } = await getDepartments()
      // some 是判断只有有一个元素符合条件就返回 true
      // every 是判断必须所有元素都符合条件才返回 true
      let isRepeat
      // 修改和编辑的校验规则不一样
      if (this.formData.id) {
        // 修改编码的校验
        isRepeat = depts.filter(dept => dept.id !== this.formData.id).some(item => item.code === value)
      } else {
        // 添加的校验
        isRepeat = depts.some(item => item.code === value)
      }
      isRepeat ? cb(new Error(`同级部门下已经存在${value}编码了`)) : cb()
    }
    return {
      // 定义一个表单数据
      formData: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '', // 部门介绍
        pid: ''
      },
      simpleList: [],
      rules: {
        name: [{ required: true, message: '部门名称不能为空', trigger: 'blur' }, { min: 3, max: 8, message: '部门名称要求3-8个字符', trigger: 'blur' }, { validator: checkDeptName, trigger: 'blur' }], // 部门名称 // 添加部门名称自定义校验规则
        code: [{ required: true, message: '部门编码不能为空', trigger: 'blur' }, { min: 1, max: 8, message: '部门编码要求3-8个字符', trigger: 'blur' }, { validator: checkDeptCode, trigger: 'blur' }], // 部门编码  添加部门编码自定义校验规则
        manager: [{ required: true, message: '部门管理者不能为空', trigger: 'blur' }], // 部门管理者
        introduce: [{ required: true, message: '部门介绍不能为空', trigger: 'blur' }, { trigger: 'blur', min: 1, max: 100, message: '部门介绍要求1-100个字符' }] // 部门介绍
      } // 校验规则{key: 数组}
    }
  },
  computed: {
    showTitle() {
      return this.formData.id ? '编辑' : '添加'
      // 也可以通过name 更方便 不需要在 onClose 方法中重新置空
      // return this.formData.name ? '编辑部门' : '新增部门'
    }
  },
  methods: {
    async onFocus() {
      // 去加载员工简单列表
      this.simpleList = await getSimpleList()
    },
    async onConfirm() {
      // 执行添加部门逻辑
      try {
        await this.$refs.deptFormRef.validate()
        console.log('验证通过')
        if (this.formData.id) {
          // 编辑
          await updateDepartments(this.formData)
          this.$message.success('部门编辑成功')
        } else {
          // 新增
          this.formData.pid = this.deptId
          await addDepartments(this.formData)
          this.$message.success('部门新增成功')
        }
        // 提示用户 部门新增成功
        // 弹窗关闭(通知父组件关闭弹窗,刷新列表)
        this.$emit('update:showDialog', false)
        // :before-close 不会自动调用关闭弹层的close方法  需要自己调用
        // @closed 会自动调用关闭弹层的close方法
        // this.onClose()
        this.$emit('update-list')
        // this.$refs.deptFormRef.resetFields()
      } catch (error) {
        console.log('验证不通过')
      }
    },
    onClose() {
      // 重置数据 因为resetFields只能重置表单上的数据 非表单上的 比如 编辑中的id不能重置
      this.formData = {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '', // 部门介绍
        pid: ''
      }
      // 移除校验结果  可以重置数据 只能重置 定义在data中的数据
      this.$refs.deptFormRef.resetFields()
      // 关闭弹窗
      this.$emit('update:showDialog', false)
    },
    // 获取编辑弹层详细方法
    async onEdit(id) {
      this.formData = await getDepartDetail(id)
      // 因为我们是父组件调用子组件的方法  先设置了 node 数据 直接调用方法
      // props 传值是异步的 所以getDepartDetail里面填this.deptId不行
      // 所以我们可以通过传入的方式来解决
    }
  }
}
</script>

<style>

</style>
