<template>
  <div class="new-page" :style="`min-height: ${pageMinHeight}px`">
    <a-card>
      <div class="search">
      </div>
      <div style="margin-top: 50px;">
        <a-space class="operator">
          <a-button type="primary" @click="addUI()">添加</a-button>
        </a-space>
        <standard-table :columns="columns" :dataSource="list" :row-key="record => record.id"
          :pagination="{ ...pagination, onChange: onPageChange }">
          <div slot="avatar" slot-scope="{text, record}">
            <a-avatar :src="record.avatar"></a-avatar>
          </div>
          <div slot="action" slot-scope="{text, record}">
            <a-popconfirm title="确认删除？" @confirm="del(record)" style="margin: 2px;">
              <a href="javascript:void(0);" type="primary">删除</a>
            </a-popconfirm>
          </div>
        </standard-table>
      </div>
    </a-card>
    <a-modal v-model="updateUIVisible" title="添加" @ok="updateUIOk">
      <a-form>
        <a-form-item name="id" label="ID" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
          <a-input v-model:value="updateUIForm['id']" disabled placeholder="请输入"></a-input>
        </a-form-item>
        <a-form-item name="name" label="名称" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
          <a-input v-model:value="updateUIForm['name']" placeholder="请输入"></a-input>
        </a-form-item>
        <a-form-item name="voiceName" label="声音唯一标识" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
          <a-input v-model:value="updateUIForm['voiceName']" placeholder="请输入"></a-input>
        </a-form-item>
        <a-form-item name="gender" label="性别" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
          <a-select v-model:value="updateUIForm['gender']" placeholder="请选择">
            <a-select-option value="1">男</a-select-option>
            <a-select-option value="2">女</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item name="avatar" label="头像" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
          <a-input v-model:value="updateUIForm['avatar']" disabled placeholder="请输入" />
          <a-upload accept="image/*" :file-list="fileList" :data="{ type: 1 }" :remove="handleRemove"
            :before-upload="beforeUpload" :customRequest="customRequest">
            <a-button> <a-icon type="upload" />点击上传图片</a-button>
          </a-upload>
          <span>上传进度：{{ percent }}</span>
        </a-form-item>
        <a-form-item name="type" label="类型" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
          <a-select v-model:value="updateUIForm['type']" placeholder="请选择">
            <a-select-option value="1">系统</a-select-option>
            <a-select-option value="2">用户</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item name="sdkType" label="SDK类型" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
          <a-select v-model:value="updateUIForm['sdkType']" placeholder="请选择">
            <a-select-option value="databaker">标贝</a-select-option>
            <a-select-option value="xunfei">讯飞</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item name="lang" label="语言" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
          <a-select v-model:value="updateUIForm['lang']" placeholder="请选择">
            <a-select-option value="putonghua">普通话</a-select-option>
            <a-select-option value="yueyu">粤语</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item name="userId" label="用户ID" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
          <a-input v-model:value="updateUIForm['userId']" placeholder="请输入"></a-input>
        </a-form-item>
        <!-- <a-form-item name="expireTime" label="过期时间" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
          <a-input v-model:value="updateUIForm['expireTime']" placeholder="请输入"></a-input>
        </a-form-item> -->
        <a-form-item name="status" label="状态" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
          <a-select v-model:value="updateUIForm['status']" placeholder="请选择" :options="statusList">
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
      
<script>
import StandardTable from '@/components/table/StandardTable';
import { mapState } from 'vuex';
import { listVoice, updateVoice, delVoice } from '@/services/voice';
import { Modal } from 'ant-design-vue';
import moment from 'moment';
import { qiniuUploadToken } from '@/services/common';
import * as qiniu from 'qiniu-js';
export default {
  name: 'VoiceList',
  components: { StandardTable },
  data() {
    return {
      fileList: [],
      percent: 0,
      module: 'voice',
      updateUIVisible: false,
      updateUIForm: {
        id: '',
        name: '',
        voiceName: '',
        gender: '',
      },
      form: {
      },
      statusList: [
        {
          value: 0,
          label: '训练中',
        },
        {
          value: 1,
          label: '训练失败',
        },
        {
          value: 2,
          label: '训练成功'
        },
        {
          value: 3,
          label: '已过期'
        },
        {
          value: 4,
          label: '预处理失败'
        }
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
          title: '名称',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: '声音唯一标识',
          dataIndex: 'voiceName',
          key: 'voiceName',
        },
        {
          title: '性别',
          dataIndex: 'gender',
          key: 'gender',
          customRender: (text, row, index) => {
            return text == 1 ? '男' : '女';
          }
        },
        {
          title: '头像',
          dataIndex: 'avatar',
          key: 'avatar',
          scopedSlots: { customRender: 'avatar' },
        },
        {
          title: '类型',
          dataIndex: 'type',
          key: 'type',
          customRender: (text, row, index) => {
            return text == 1 ? '系统' : '用户';
          }
        },
        {
          title: 'SDK类型',
          dataIndex: 'sdkType',
          key: 'sdkType',
          customRender: (text, row, index) => {
            return text == 'databaker' ? '标贝' : text == 'xunfei' ? '讯飞' : '';
          }
        },
        {
          title: '语言',
          dataIndex: 'lang',
          key: 'lang',
          customRender: (text, row, index) => {
            return text == 'putonghua' ? '普通话' : text == 'yueyu' ? '粤语' : '';
          }
        },
        {
          title: '用户id',
          dataIndex: 'userId',
          key: 'userId',
          customRender: (text, row, index) => {
            return text == 0 ? '系统' : text;
          }
        },
        {
          title: '过期时间',
          dataIndex: 'expireTime',
          key: 'expireTime',
          customRender: (text, row, index) => {
            return moment(text).format("YYYY-MM-DD HH:mm");
          }
        },
        {
          title: '状态',
          dataIndex: 'status',
          key: 'status',
          customRender: (text, row, index) => {
            const that = this;
            var label = '';
            for (var idx in that.statusList) {
              if (that.statusList[idx].value == text) {
                label = that.statusList[idx].label;
                break;
              }
            }
            return label;
          }
        },
        {
          title: '创建时间',
          dataIndex: 'createdTime',
          key: 'createdTime',
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
    handleRemove(file) {
      const index = this.fileList.indexOf(file);
      const newFileList = this.fileList.slice();
      newFileList.splice(index, 1);
      this.fileList = newFileList;
      console.log("handle remove file", newFileList);
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
            that.percent = total.percent + "%";
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
      this.updateUIForm['avatar'] = url;
    },
    onPageChange(page, pageSize) {
      this.pagination.current = page;
      this.pagination.pageSize = pageSize;
      this.queryList();
    },
    init() {
      this.queryList();
    },
    queryList() {
      const that = this;
      listVoice({current: that.pagination.current, size: that.pagination.pageSize}).then((res) => {
        const r = res.data;
        const data = r.data;
        that.pagination = {
          current: parseInt(data.current),
          pageSize: parseInt(data.size),
          total: parseInt(data.total)
        };
        that.list = data.records;
      });
    },
    addUI() {
      const that = this;
      that.$util.clearObject(that.updateUIForm, true);
      that.updateUIVisible = true;
    },
    updateUI(record) {
      const that = this;
      that.$util.clearObject(that.updateUIForm, true);
      that.$util.extend(true, that.updateUIForm, record);
      that.updateUIVisible = true;
    },
    updateUIOk() {
      const that = this;
      updateVoice({...that.updateUIForm}).then((res) => {
        const r = res.data;
        if (r.code != 200) {
          return;
        }
        const data = r.data;
        that.$message.success('添加成功');
        that.init();
        that.updateUIVisible = false;
      });
    },
    del(record) {
      const that = this;
      delVoice({id: record.id}).then((res) => {
        const r = res.data;
        if (r.code != 200) {
          return;
        }
        that.$message.success('删除成功');
        that.init();
      });
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