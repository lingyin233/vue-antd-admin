<template>
  <div class="new-page" :style="`min-height: ${pageMinHeight}px`">
    <a-card>
      <div class="search">
        <a-form layout="horizontal" :model="form">
          <a-row>
            <a-col :md="8" :sm="24">
              <a-form-item name="name" label="APPID" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <appid-select v-model:value="form['appId']" placeholder="请输入"></appid-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item name="name" label="名称" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-input v-model:value="form['name']" placeholder="请输入"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item name="gender" label="性别" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-select v-model:value="form['gender']" placeholder="请选择" :options="genderList">
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item name="type" label="类型" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-select v-model:value="form['type']" placeholder="请选择" :options="typeList">
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <span style="margin-top: 3px;">
            <a-button type="primary" @click="queryAppearance()">查询</a-button>
            <a-button style="margin-left: 8px" @click="$util.clearObject(form, true)">重置</a-button>
          </span>
        </a-form>
      </div>
      <div style="margin-top: 50px;">
        <a-space class="operator">
          <a-button type="primary" @click="addUI">
            添加
          </a-button>
        </a-space>
        <standard-table :columns="columns" :dataSource="list" :row-key="record => record.id"
          :pagination="{ ...pagination, onChange: onPageChange }">
          <div slot="gender" slot-scope="{text, record}">
            <span v-if="record.gender == 1">男</span>
            <span v-else-if="record.gender == 2">女</span>
            <span v-else-if="record.gender == 3">其他</span>
          </div>
          <div slot="picUrl" slot-scope="{text, record}">
            <img style="width: 50px; height: 80px;" :src="record.picUrl" />
          </div>
          <div slot="type" slot-scope="{text, record}">
            <span v-if="record.type == 0">系统</span>
            <span v-if="record.type == 1">常规</span>
            <span v-if="record.type == -1">禁用</span>
          </div>
          <div slot="status" slot-scope="{text, record}">
            <span v-if="record.status == 0">删除</span>
            <span v-if="record.status == 1">正常</span>
          </div>
          <div slot="action" slot-scope="{text, record}">
            <a href="javascript:void(0);" type="primary" @click="updateUI(record)" style="margin-left: 2px;">修改</a>
            <a-popconfirm title="确认删除？" @confirm="del(record)" style="margin-left: 2px;">
              <a href="javascript:void(0);" type="primary">删除</a>
            </a-popconfirm>
            <a href="javascript:void(0);" type="primary" @click="updateUI(record, true)" style="margin-left: 2px;">复制</a>
          </div>
        </standard-table>
      </div>
    </a-card>
    <a-modal v-model="updateUIVisible" title="添加或更新" @ok="saveAppearance" :maskClosable="false">
      <a-form>
        <a-form-item name="id" label="ID" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
          <a-input v-model:value="updateForm['id']" disabled placeholder="请输入"></a-input>
        </a-form-item>
        <a-form-item name="roleId" label="角色" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
          <a-input v-model:value="updateForm.roleId" placeholder="请输入" />
        </a-form-item>
        <a-form-item name="name" label="名称" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
          <a-input v-model:value="updateForm.name" placeholder="请输入" />
        </a-form-item>
        <a-form-item name="gender" label="性别" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
          <a-select v-model:value="updateForm['gender']" placeholder="请选择" :options="genderList">
          </a-select>
        </a-form-item>
        <a-form-item name="type" label="类型" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
          <a-select v-model:value="updateForm.type" placeholder="请选择" :options="typeList">
          </a-select>
        </a-form-item>
        <a-form-item name="picUrl" label="图片" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
          <a-input v-model:value="updateForm.picUrl" disabled placeholder="请输入" />
          <a-upload accept="image/*" :file-list="fileList2" :data="{ type: 2 }" :remove="handleRemove"
            :before-upload="beforeUpload2" :customRequest="customRequest">
            <a-button> <a-icon type="upload" />点击上传图片</a-button>
          </a-upload>
          <span>{{ percent2 }}</span>
        </a-form-item>
        <a-form-item name="infoUrl" label="资源包" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
          <a-input v-model:value="updateForm.infoUrl" disabled placeholder="请输入" />
          <a-upload accept=".zip" :file-list="fileList" :data="{ type: 1 }" :remove="handleRemove"
            :before-upload="beforeUpload" :customRequest="customRequest">
            <a-button> <a-icon type="upload" />点击上传文件</a-button>
          </a-upload>
          <span>{{ percent1 }}</span>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
      
<script>
import StandardTable from '@/components/table/StandardTable';
import AppidSelect from '@/components/obx/AppidSelect';
import { mapState } from 'vuex';
import { listAppearance, delAppearance, addAppearance } from '@/services/appearance';
import { qiniuUploadToken } from '@/services/common';
import * as qiniu from 'qiniu-js';
import { Modal } from 'ant-design-vue';
import moment from 'moment';
export default {
  name: 'AppearanceList',
  components: { StandardTable, AppidSelect },
  data() {
    return {
      updateUIVisible: false,
      fileList2: [],
      fileList: [],
      module: 'appearance2',
      percent1: 0,
      percent2: 0,
      updateForm: {
        id: '',
        roleId: '',
        name: '',
        gender: '',
        infoUrl: '',
        picUrl: '',
        type: '',
        appId: '',
      },
      form: {
        name: '',
        gender: '',
        type: '',
      },
      genderList: [
        {
          value: '',
          label: "请选择"
        },
        {
          value: "1",
          label: "男"
        },
        {
          value: "2",
          label: "女"
        }
      ],
      typeList: [
        {
          value: "",
          label: "请选择"
        },
        {
          value: "0",
          label: "系统"
        },
        {
          value: "1",
          label: "常规"
        },
      ],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
      list: [],
      columns: [
        {
          title: 'ID',
          dataIndex: 'id',
          key: 'id',
        },
        {
          title: '角色',
          dataIndex: 'roleId',
          key: 'roleId',
        },
        {
          title: '性别',
          dataIndex: 'gender',
          key: 'gender',
          scopedSlots: { customRender: 'gender' },
        },
        {
          title: '名称',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: '图片地址',
          dataIndex: 'picUrl',
          key: 'picUrl',
          scopedSlots: { customRender: 'picUrl' },
        },
        {
          title: '文件地址',
          dataIndex: 'infoUrl',
          key: 'infoUrl',
        },
        {
          title: '类型',
          dataIndex: 'type',
          key: 'type',
          scopedSlots: { customRender: 'type' },
        },
        {
          title: '状态',
          dataIndex: 'status',
          key: 'status',
          scopedSlots: { customRender: 'status' },
        },
        {
          title: 'APPID',
          dataIndex: 'appId',
          key: 'appId',
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          key: 'createTime',
          customRender: (text, row, index) => {
            return moment(text).format('YYYY-MM-DD HH:mm');
          }
        },
        {
          title: '操作',
          dataIndex: 'action',
          key: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ]
    };
  },
  methods: {
    onPageChange(page, pageSize) {
      this.pagination.current = page;
      this.pagination.pageSize = pageSize;
      this.queryAppearance();
    },
    showSizeChange(current, size) {
      console.log('current=', current, 'size=', size);
      this.pageSize = size;
      this.queryAppearance();
    },
    changePage(page, pageSize) {
      console.log('page=', page, 'pageSize=', pageSize);
      this.queryAppearance();
    },
    init() {
      this.queryAppearance();
    },
    queryAppearance() {
      const that = this;
      listAppearance({ current: that.pagination.current, size: that.pagination.pageSize, ...that.form }).then((res) => {
        const r = res.data;
        if (r.code !== 200) {
          return;
        }
        const data = r.data;
        that.list = data.records;
        that.pagination = {
          total: parseInt(data.total),
          current: parseInt(data.current),
          pageSize: parseInt(data.size),
        };
      });
    },
    del(record) {
      const that = this;
      delAppearance({ id: record.id }).then((res) => {
        const r = res.data;
        if (r.code !== 200) {
          return;
        }
        that.$message.success("删除成功", 1.5, () => {
          that.init();
        });
      });
    },
    addUI() {
      this.$util.clearObject(this.updateForm, true);
      this.updateForm.type = '1';
      this.updateUIVisible = true;
    },
    updateUI(record, copy) {
      const that = this;
      this.$util.clearObject(this.updateForm, true);
      this.$util.extend(true, this.updateForm, record);
      this.updateForm['gender'] = record.gender + '';
      if (copy) {
        that.updateForm['id'] = '';
        that.updateForm['infoUrl'] = '';
        that.updateForm['picUrl'] = '';
      }
      this.updateUIVisible = true;
    },
    saveAppearance() {
      const that = this;
      addAppearance({ ...that.updateForm }).then((res) => {
        const r = res.data;
        if (r.code !== 200) {
          return;
        }
        that.$message.success("保存成功", 1.5, () => {
          that.updateUIVisible = false;
          that.init();
        });
      });
    },
    handleRemove(file) {
      const index = this.fileList.indexOf(file);
      const newFileList = this.fileList.slice();
      newFileList.splice(index, 1);
      this.fileList = newFileList;
      console.log("handle remove file", newFileList);
    },
    beforeUpload2(file, fileList) {
      this.fileList2 = fileList;
      return true;
    },
    beforeUpload(file, fileList) {
      this.fileList = fileList;
      return true;
    },
    customRequest(data) {
      console.log(data, "==== customRequest");
      const that = this;
      const file = data.file;
      const type = data.data.type;
      console.log(type, "==== type");
      if (file) {
        if (file.name.lastIndexOf(".") < 0) {
          that.$message.error("文件格式不正确");
          return;
        }
        const ext = file.name.substring(file.name.lastIndexOf("."));
        qiniuUploadToken({ ext: ext, module: that.module }).then((res) => {
          const r = res.data;
          if (r.code !== 200) {
            return;
          }
          const data = r.data;
          console.log("upload token", data);
          const token = data.token;
          const host = data.host;
          const fileKey = data.fileKey;
          const observable = qiniu.upload(file, fileKey, token, {}, {});
          const subscription = observable.subscribe((nextRes) => {
            const total = nextRes.total;
            console.log("next", total.loaded, total.total, total.percent);
            if (type == 1) {
              that.percent1 = total.percent + "%";
            } else if (type == 2) {
              that.percent2 = total.percent + "%";
            }
          }, (err) => {
            console.log("error", err.code, err.message, err.isRequestError);
          }, (completeRes) => {
            console.log("complete", completeRes);
            that.uploadCallback(host + "/" + completeRes.key, type);
          });
        });
      } else {
        console.error('没有选择文件');
      }
    },
    uploadCallback(url, type) {
      if (type == 2) {
        this.updateForm.picUrl = url;
      } else {
        this.updateForm.infoUrl = url;
      }
    },
  },
  created() {
    this.init();
  },
  computed: {
    ...mapState('setting', ['pageMinHeight']),
    desc() {
      return this.$t('description');
    }
  }
};
</script>
      
<style scoped lang="less">
@import "index";

.search {
  margin-bottom: 54px;
}

.operator {
  margin-bottom: 18px;
}
</style>