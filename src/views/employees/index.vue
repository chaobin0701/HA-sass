<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools :show-before="true">
        <span slot="before">共{{page.total}}条记录</span>
        <template slot="after">
          <el-button size="small" type="warning" @click="$router.push('/import?type=user')">excel导入</el-button>
          <el-button size="small" type="danger" @click="exportData">excel导出</el-button>
          <!-- 放置新增组件 -->
          <add-demployee :show-dialog.sync="showDialog" />
          <el-button icon="plus" type="primary" size="small" @click="showDialog = true">新增员工</el-button>
        </template>
      </page-tools>
      <!-- 放置表格和分页 -->
      <el-card v-loading="loading">
        <el-table border :data="list">
          <el-table-column label="序号" sortable="" type="index"></el-table-column>
          <el-table-column label="姓名" sortable="" prop="username"></el-table-column>
          <el-table-column label="工号" sortable="" prop="workNumber"></el-table-column>
          <el-table-column label="聘用形式" sortable="" :formatter="formatEmployment" prop="formOfEmployment">
          </el-table-column>
          <el-table-column label="部门" sortable="" prop="departmentName"></el-table-column>
          <el-table-column label="入职时间" sortable="" prop="timeOfEntry">
            <template slot-scope="{row}">
              {{ row.timeOfEntry | formatDate}}
            </template>
          </el-table-column>
          <el-table-column label="账户状态" align="center" sortable="" prop="enableState">
            <template slot-scope="{row}">
              <el-switch :value="row.enableState === 1"></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" sortable="" fixed="right" width="280">
            <template slot-scope="{row}">
              <el-button  type="text" size="small"
                @click="$router.push(`/employees/detail/${obj.row.id}`)">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small" @click="editRole(row.id)">角色</el-button>
              <el-button type="text" size="small" @click="deleteEmployee(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-row type="flex" justify="center" align="middle">
          <el-pagination layout="prev,pager,next" :page-size="page.size" :current-page="page.page" :total="page.total"
            @current-change="changePage"></el-pagination>
        </el-row>
      </el-card>
    </div>
    <!--  -->
    <assign-role :show-role-dialog.sync="showRoleDialog" :user-id="userId" ref="assignRole"></assign-role>
  </div>
</template>

<script>
import { getEmployeeList, deleteEmployee } from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees' //聘用形式枚举数据
import AddDemployee from './components/add-employee.vue'
import AssignRole from './components/assign-role.vue'
import { formatDate } from '@/filters'
export default {
  data() {
    return {
      loading: false,
      list: [], //数据
      page: {
        page: 1,
        size: 10,
        total: 0
      },
      showDialog: false,//默认是关闭的弹层
      showRoleDialog: false, //显示分配的弹层
      userId: null, //定义一个userId
    }
  },
  components: { AddDemployee, AssignRole },
  created() {
    this.getEmployeeList()
  },
  methods: {
    changePage(newPage) {
      this.page.page = newPage
      this.getEmployeeList()
    },
    // 获取员工信息
    async getEmployeeList() {
      this.loading = true
      const { total, rows } = await getEmployeeList(this.page)
      this.page.total = total
      this.list = rows
      this.loading = false
    },
    // 删除员工信息
    async deleteEmployee(id) {
      try {
        await this.$confirm('您确定删除该员工吗')
        await deleteEmployee(id)
        this.getEmployeeList()
        this.$message.success("删除员工成功")
      } catch (error) {
        console.log(error)
      }
    },
    //格式化聘用形式
    formatEmployment(row, column, cellValue, index) {
      const obj = EmployeeEnum.hireType.find(item => item.id === cellValue)
      return obj ? obj.value : '未知'
    },
    // 到处excel
    async exportData() {
      // 表头对应关系
      const headers = {
        '姓名': 'username',
        '手机号': 'mobile',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      // 懒加载
      import('@/vendor/Export2Excel').then(async excel => {
        const { rows } = await getEmployeeList({ page: 1, size: this.page.total })
        const data = this.formatJson(headers, rows)
        excel.export_json_to_excel({
          header: Object.keys(headers), //表头 必填
          data, //具体数据 必填
          filename: '员工信息表', //非必填
          autoWidth: true, //非必填
          bookType: 'xlsx' //非必填
        })
      })
    },
    // 该方法负责将数组转化成二维数组
    formatJson(headers, rows) {
      // 首先遍历数组
      return rows.map(item => {
        return Object.keys(headers).map(key => {
          if (headers[key] === 'timeOfEntry' || headers[key] === 'correctionTime') {
            return formatDate(item[headers[key]]) // 返回格式化之前的时间
          } else if (headers[key] === 'formOfEmployment') {
            var en = EmployeeEnum.hireType.find(obj => obj.id === item[headers[key]])
            return en ? en.value : '未知'
          }
          return item[headers[key]]
        })
      })
    },
    // 编辑用户角色
    async editRole(id) {
      this.userId = id
      // 调用子组件的方法
      await this.$refs.assignRole.getUserDetailById(id)
      this.showRoleDialog = true
    }
  }
}
</script>

<style>

</style>