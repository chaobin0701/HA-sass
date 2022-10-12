<template>
  <!-- 公共导入组件 -->
  <upload-excel :on-success="success" />
</template>

<script>
import UploadExcel from '@/components/UploadExcel'
import { importEmployee } from '@/api/employees'
export default {
  data() {
    return {
      type: this.$route.query.type
    }
  },
  methods: {
    async success({ header, results }) {
      // 如果是导入员工
      const userRelations = {
        '入职日期': 'timeOfEntry',
        '手机号': 'mobile',
        '姓名': 'username',
        '转正日期': 'correctionTime',
        '工号': 'workNumber'
      }
      var newArr = results.map(item => {
        var userInfo = {}
        Object.keys(item).forEach(key => {
          if(userInfo[userRelations[key]] === 'correctionTime' || userInfo[userRelations[key]] === 'timeOfEntry' ){
            userInfo[userRelations[key]] = new Date(this.formatDate(item[key],'/'))
            return
          }
          userInfo[userRelations[key]] = item[key] //将原来中文对应的值 赋值给原来英文对应的值
        })
        return userInfo
      })
      await importEmployee(newArr) // 调用导入接口
      this.$message.success('导入excel成功')
      this.$router.back() //返回上一个页面
    },
    // 转换excel的日期格式
    formatDate(numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1)
      time.setYear(time.getFullYear() - 70)
      const year = time.getFullYear() + ''
      const month = time.getMonth() + 1 + ''
      const date = time.getDate() - 1 + ''
      if (format && format.length === 1) {
        return year + format + month + format + date
      }
      return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
    }
    
  }

}
</script>
<style scoped>

</style>