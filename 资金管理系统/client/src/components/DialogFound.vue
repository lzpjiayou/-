<template>
    <div class="logFund">
            <el-dialog 
            :title="Dialog.title"  
            :visible.sync="Dialog.show" 
            :close-on-click-modal="false"  
            :close-on-press-escape="false" 
            :modal-append-to-body="false">  
            <div class="form">
            <el-form ref="form" :model="form" :rules="rules" label-width="120px" style="margin:10px;width:auto;">
                    <el-form-item label="收支类型:">
                        <el-select v-model="form.type" placeholder="收支类型">
                            <el-option v-for="(formtype,index) in format_type_list" :key="index" :lable="formtype" :value="formtype"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop='describe' label="收支描述:">
                        <el-input type="describe" v-model="form.describe"></el-input>
                    </el-form-item>
                    <el-form-item  prop='income' label="收入:">
                        <el-input type="income" v-model="form.income" ></el-input>
                    </el-form-item>
                    <el-form-item  prop='expend' label="支出:">
                        <el-input type="expend" v-model="form.expend" ></el-input>
                    </el-form-item>
                    <el-form-item  prop='cash' label="账目现金:">
                        <el-input type="cash" v-model="form.cash" ></el-input>
                    </el-form-item>
                    <el-form-item  prop='remark' label="备注:">
                        <el-input type="remark" v-model="form.remark" ></el-input>
                    </el-form-item>
                    <el-form-item class="text_right">
                        <el-button @click="Dialog.show = false">取消</el-button>
                        <el-button type="primary" @click="onSubmit('form')">提交</el-button>
                    </el-form-item>
            </el-form>
        </div> 
            </el-dialog>
    </div>
</template>

<script>
import { object } from 'webidl-conversions';
export default {
        name:'Dialog',
        data(){
                return {
                    format_type_list:[
                        '提现',
                        '提现手续费',
                        '充值',
                        '优惠券',
                        '充值礼券',
                        '转账'
                    ],
                    rules:{
                        describe:[
                            {required:true,message:'收支描述不能为空',trigger:'blur'}
                        ],
                        income:[
                            {required:true,message:'支出不能为空',trigger:'blur'}
                        ],
                        expend:[
                            {required:true,message:'收入不能为空',trigger:'blur'}
                        ],
                        cash: [
                            {required:true,message:'账目现金不能为空',trigger:'blur'}
                        ]
                    }
                }              
        },
        props:{
            Dialog:Object,
            form:object
        },
        methods:{
            onSubmit(form){
                this.$refs[form].validate(valid=>{
                    if(valid){
                        const url = this.Dialog.option == 'add' ? 'add' : `edit/${this.form.id}`;
                        // console.log(url);
                        this.$axios.post(`/api/profiles/${url}`,this.form)
                        .then(res=>{
                            this.$message({
                                message:'数据添加成功',
                                type:'success'
                            });
                            this.Dialog.show=false;
                            this.$emit('update');
                        })
                    }
                })
            }
        }
};
</script>

<style>

</style>