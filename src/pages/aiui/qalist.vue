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
          <div slot="status" slot-scope="{text, record}">
            <a-switch checked-children="启用" un-checked-children="禁用" :defaultChecked="record.status == 1"
              @change="(checked, e) => onChangeStatus(checked, e, record)"></a-switch>
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
        <a-form-item name="question" label="问题" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
          <a-input v-model:value="updateUIForm['question']" placeholder="请输入"></a-input>
        </a-form-item>
        <a-form-item name="type" label="类型" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
          <a-select v-model:value="updateUIForm['type']" placeholder="请选择">
            <a-select-option value="1">文字</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item name="answer" label="内容" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
          <a-textarea v-model:value="updateUIForm['answer']" placeholder="请输入"></a-textarea>
        </a-form-item>
        <!-- <a-form-item name="avatar" label="头像" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
          <a-input v-model:value="updateUIForm['avatar']" disabled placeholder="请输入" />
          <a-upload accept="image/*" :file-list="fileList" :data="{ type: 1 }" :remove="handleRemove"
            :before-upload="beforeUpload" :customRequest="customRequest">
            <a-button> <a-icon type="upload" />点击上传图片</a-button>
          </a-upload>
          <span>上传进度：{{ percent }}</span>
        </a-form-item> -->
        <a-form-item name="status" label="状态" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
          <a-select v-model:value="updateUIForm['status']" placeholder="请选择">
            <a-select-option value="1">启用</a-select-option>
            <a-select-option value="0">禁用</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
      
<script>
import StandardTable from '@/components/table/StandardTable';
import { mapState } from 'vuex';
import { qaList, qaAdd, qaDel, qaUpdateStatus } from '@/services/aiui';
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
        
      },
      form: {
      },
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
          title: '问题',
          dataIndex: 'question',
          key: 'question',
        },
        {
          title: '类型',
          dataIndex: 'type',
          key: 'type',
          customRender: (text, record, index) => {
            if (text == '1') {
              return '文字';
            } else if (text == 2) {
              return '音频';
            } else if (text == 3) {
              return '图文';
            } else if (text == 4) {
              return '视频';
            } else if (text == 5) {
              return '图片';
            }
            return '未知';
          }
        },
        {
          title: '内容',
          dataIndex: 'answer',
          key: 'answer',
        },
        {
          title: '状态',
          dataIndex: 'status',
          key: 'status',
          scopedSlots: { customRender: 'status' },
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
      qaList({current: that.pagination.current, size: that.pagination.pageSize}).then((res) => {
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
      qaAdd({...that.updateUIForm}).then((res) => {
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
      qaDel({id: record.id}).then((res) => {
        const r = res.data;
        if (r.code != 200) {
          return;
        }
        that.$message.success('删除成功');
        that.init();
      });
    },
    onChangeStatus(checked, e, record) {
      const that = this;
      if (checked) {
        record['status'] = 1;
      } else {
        record['status'] = 0;
      }
      qaUpdateStatus({ id: record.id, status: record.status }).then((res) => {
        const r = res.data;
        if (r.code != 200) {
          return;
        }
        that.$message.success('操作成功');
        that.init();
      });
    },
  },
  mounted() {
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