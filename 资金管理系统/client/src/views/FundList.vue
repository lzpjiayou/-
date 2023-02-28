<!--  -->
<template>
    <div class="fillcontain">
      <div>
        <el-form :inline="true" ref="add_data">
          <el-form-item label="按照时间筛选:" :model="search_data">
            <el-date-picker
                  v-model="search_data.startTime"
                  type="datetime"
                  placeholder="选择开始时间"
            >
            </el-date-picker>
            --
            <el-date-picker
                  v-model="search_data.endTime"
                  type="datetime"
                  placeholder="选择结束时间"
            >
            </el-date-picker>
            <el-form-item>
            <el-button type="primary" size="small" icon="search" @click="handleSearch()">筛选
            </el-button>
          </el-form-item>
          </el-form-item>
          <el-form-item class="btnRight">
            <el-button type="primary" size="small" icon="view" v-if="user.identity == 'manager'" @click="handleAdd()">添加
            </el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="table_container">
    <el-table
    v-if="tableData.length > 0"
    :data="tableData"
    max-height="450"
    border
    style="width: 100%">
    <el-table-column type="index" label="序号" align="center" width="70">
        </el-table-column> 
    <el-table-column
      prop="date"
      label="创建时间"
      align="center"
      width="250">
      <template slot-scope="scope">
        <i class="el-icon-time"></i>
        <span style="margin-left: 10px">{{ scope.row.date }}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="type"
      label="收支类型"
      align="center"
      width="120">
      <template slot-scope="scope">
        <span >{{ scope.row.type }}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="describe"
      label="收支描述"
      align="center"
      width="120">
      <template slot-scope="scope">
        <span>{{ scope.row.describe }}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="income"
      label="收入"
      align="center"
      width="120">
      <template slot-scope="scope">
        <span style="color: #00d053;">{{ scope.row.income }}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="expend"
      label="支出"
      align="center"
      width="120">
      <template slot-scope="scope">
        <span style="color: #f56567;">{{ scope.row.expend }}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="cash"
      label="账目现金"
      align="center"
      width="120">
      <template slot-scope="scope">
        <span style="color: #4db3ff">{{ scope.row.cash }}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="remark"
      label="备注"
      align="center"
      width="150">
      <template slot-scope="scope">
        <span>{{ scope.row.remark }}</span>
      </template>
    </el-table-column>
    <el-table-column label="操作" prog="operation" align="center" width="250" v-if="user.identity == 'manager'">
      <template slot-scope="scope">
        <el-button
          type="warning"
          size="small"
          icon="edit"
          @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
        <el-button
          size="small"
          type="danger"
          icon="delete"
          @click="handleDelete(scope.$index, scope.row)">删除</el-button>
      </template>
    </el-table-column>
    </el-table>
    <el-row>
      <el-row :span="24">
        <div class="pagination">
          <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="pagination.page_index"
              :page-sizes="pagination.page_sizes"
              :page-size="pagination.page_size"
              :layout="pagination.layout"
              :total="pagination.total">
          </el-pagination>
        </div>
      </el-row>
    </el-row>
      </div>
<V-Dialog :Dialog="Dialog" :form="form" @update="getProfile"></V-Dialog>
</div>
</template>

<script>
import Dialog from '../components/DialogFound.vue';
export default {
    name:"fundList",
    data() {
        return {
                search_data:{
                  startTime:'',
                  endTime:''
                },
                fitterTabledata:[],
                pagination:{
                  page_index:1,//当前位于哪一页
                  total:0, //总数
                  page_size:5,//一页显示多少条
                  page_sizes:[5,10,15,20], //每页显示多少条
                  layout:"total, sizes, prev, pager, next, jumper" //翻页属性            
                },
                tableData:[],
                allTabledata:[],
                form: {
                        type:'',
                        describe:'',
                        income:'',
                        expend:'',
                        cash:'',
                        remark:'',
                        id:''
                    },
                Dialog:{
                  show:false,
                  title:'',
                  option:'edit'
                }
        }
    },
    computed:{
      user(){
       return  this.$store.getters.user
      }
    },
    created() {
        this.getProfile();

    },
  
    mounted() {

    },
    methods: {
        getProfile(){
            this.$axios.get("/api/profiles")
            .then(res => {
                // console.log(res.data)
                this.allTabledata = res.data;
                this.fitterTabledata = res.data;
                // console.log(this.allTabledata);
                //设置分页属性
                this.setPagination();
            }
            )
            .catch(err =>console.log(err))
        },
        handleSearch(){
                if(!this.search_data.startTime || !this.search_data.endTime){
                  this.$message({
                    type:'warning',
                    message:'请选择时间区间'
                  });
                  this.getProfile();
                  return;
                }
                const sTime = this.search_data.startTime.getTime();
                const eTime = this.search_data.endTime.getTime();

                this.allTabledata = this.fitterTabledata.filter(item=>{
                  let date = new Date(item.date);
                  let time = date.getTime();
                  return time >= sTime && time <= eTime;
                })

                this.setPagination();
        },
        handleEdit(index,row){       
                this.Dialog = {
                  show : true,
                  title:'修改资金信息',
                  option: 'edit'
                },
                this.form = {
                  type : row.type,
                  describe : row.describe,
                  income : row.income,
                  expend : row.expend,
                  cash : row.cash,
                  remark : row.remark,
                  id : row._id
                }
        },
        handleDelete(index,row){
            this.$axios.delete(`/api/profiles/delete/${row._id}`)
            .then(res =>{
            this.$message('删除成功');
            this.getProfile()
            })
        },
        handleAdd(){
          this.Dialog = {
                  show : true,
                  title:'添加资金信息',
                  option: 'add'
                },
                this.form = {
                        type:'',
                        describe:'',
                        income:'',
                        expend:'',
                        cash:'',
                        remark:'',
                        id:''
                }
        },
        setPagination(){
          //分页属性设置
          this.pagination.total = this.allTabledata.length;
          this.pagination.page_index = 1;
          this.pagination.page_size = 5;
          //设置默认的分页数据
          this.tableData = this.allTabledata.filter((item,index) =>{
            return index < this.pagination.page_size;
          });
        },
        handleSizeChange(page_size){
          this.pagination.page_index = 1,
          this.pagination.page_size = page_size;
          this.tableData = this.allTabledata.filter((item,index) =>{
            return index < page_size;
          });
        },
        handleCurrentChange(page){
          //获取当前页
          let index = this.pagination.page_size * (page - 1);
          //获取数据总数
          let nums = this.pagination.page_size * page;
          //容器
          let tables =[];

          for(let i = index; i < nums; i++){
            if(this.allTabledata[i]) {
              tables.push(this.allTabledata[i])
            }
          };
          this.tableData = tables;

        }

    },
    components:{
      'V-Dialog':Dialog
    }
}
</script>
<style scoped>
.fillcontain {
  width: 100%;
  height: 100%;
  padding: 16px;
  box-sizing: border-box;
}
.btnRight {
  float: right;
}
.pagination {
  float: right;
  margin-top: 10px;
}
</style>