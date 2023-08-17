<template>
  <div class="new-page" :style="`min-height: ${pageMinHeight}px`">
    <a-card>
      <div class="search">
        <a-form layout="horizontal" :model="form">
          <a-row>
            <a-col :md="8" :sm="24">
              <a-form-item name="type" label="类型" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-select v-model:value="form['type']" placeholder="请选择" :options="typeList">
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <span style="margin-top: 3px;">
            <a-button type="primary" @click="query()">查询</a-button>
            <a-button style="margin-left: 8px" @click="$util.clearObject(form, true)">重置</a-button>
          </span>
        </a-form>
      </div>
      <div style="margin-top: 50px;">
        <a-space class="operator">
          <a-button type="primary" @click="addUI()">添加</a-button>
        </a-space>
        <standard-table :columns="columns" :dataSource="list" :row-key="record => record.id"
          :pagination="{ ...pagination, onChange: onPageChange }">
          <div slot="action" slot-scope="{text, record}">
            <a-popconfirm title="确认删除？" @confirm="del(record)" style="margin: 2px;">
              <a href="javascript:void(0);" type="primary">删除</a>
            </a-popconfirm>
            <a v-if="record.push == 0" href="javascript:void(0);" @click="push(record)">开启推送</a>
            <a v-else href="javascript:void(0);" @click="push(record)">关闭推送</a>
          </div>
        </standard-table>
      </div>
    </a-card>
    <a-modal v-model="updateUIVisible" title="添加或更新" @ok="updateUIOk" :maskClosable="false">
      <a-form>
        <a-form-item name="id" label="ID" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
          <a-input v-model:value="updateUIForm['id']" disabled placeholder="请输入"></a-input>
        </a-form-item>
        <a-form-item name="applicationId" label="应用ID" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
          <a-input v-model:value="updateUIForm['applicationId']" placeholder="请输入"></a-input>
        </a-form-item>
        <a-form-item name="type" label="类型" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
          <a-select v-model:value="updateUIForm['type']" placeholder="请选择" :options="typeList">
          </a-select>
        </a-form-item>
        <a-form-item name="versionCode" label="整数版本号" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
          <a-input v-model:value="updateUIForm['versionCode']" placeholder="请输入"></a-input>
        </a-form-item>
        <a-form-item name="versionName" label="版本名称" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
          <a-input v-model:value="updateUIForm['versionName']" placeholder="请输入"></a-input>
        </a-form-item>
        <a-form-item name="versionContent" label="版本内容" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
          <a-textarea v-model:value="updateUIForm['versionContent']" placeholder="请输入"></a-textarea>
        </a-form-item>
        <a-form-item name="url" label="文件" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
          <a-input v-model:value="updateUIForm['url']" disabled placeholder="请输入"></a-input>
          <a-upload accept="*/*" :file-list="fileList" :remove="handleRemove" :before-upload="beforeUpload"
            :customRequest="customRequest">
            <a-button> <a-icon type="upload" />点击上传文件</a-button>
          </a-upload>
        </a-form-item>
        <a-form-item name="appSize" label="APP大小" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
          <a-input v-model:value="updateUIForm['appSize']" placeholder="请输入"></a-input>
        </a-form-item>
        <a-form-item name="hashValue" label="APP MD5值" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
          <a-input v-model:value="updateUIForm['hashValue']" placeholder="请输入"></a-input>
        </a-form-item>
        <a-form-item name="force" label="是否强制升级" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
          <a-switch @change="forceChange" />
        </a-form-item>
        <a-form-item name="push" label="是否推送" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
          <a-switch @change="pushChange" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
      
<script>
import StandardTable from '@/components/table/StandardTable';
import { mapState } from 'vuex';
import { listAppUpdate, addAppUpdate, delAppUpdate, pushStateAppUpdate } from '@/services/appupdate';
import { qiniuUploadToken } from '@/services/common';
import * as qiniu from 'qiniu-js';
import { Modal } from 'ant-design-vue';
import moment from 'moment';
export default {
  name: 'AppUpdateList',
  components: { StandardTable },
  data() {
    return {
      module: 'appupdate',
      fileList: [],
      updateUIVisible: false,
      updateUIForm: {
        id: null,
        applicationId: null,
        type: null,
        versionCode: null,
        versionName: null,
        versionContent: null,
        appSize: null,
        hashValue: null,
        force: null,
        url: null,
        push: null,
      },
      typeList: [
        {
          label: 'IOS',
          value: 'IOS',
        },
        {
          label: 'ANDROID',
          value: 'ANDROID',
        },
        {
          label: 'DEVICE',
          value: 'DEVICE',
        },
      ],
      form: {
        type: '',
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
          title: '应用ID',
          dataIndex: 'applicationId',
          key: 'applicationId',
        },
        {
          title: '类型',
          dataIndex: 'type',
          key: 'type',
        },
        {
          title: '整数版本号',
          dataIndex: 'versionCode',
          key: 'versionCode',
        },
        {
          title: '版本名称',
          dataIndex: 'versionName',
          key: 'versionName',
        },
        {
          title: '版本内容',
          dataIndex: 'versionContent',
          key: 'versionContent',
        },
        {
          title: '大小',
          dataIndex: 'appSize',
          key: 'appSize',
        },
        {
          title: 'hash',
          dataIndex: 'hashValue',
          key: 'hashValue',
        },
        {
          title: '是否强制升级',
          dataIndex: 'force',
          key: 'force',
          customRender: (text, row, index) => {
            return text == '1' ? '是' : text == '0' ? '否' : '';
          }
        },
        {
          title: '是否推送',
          dataIndex: 'push',
          key: 'push',
          customRender: (text, row, index) => {
            return text == '1' ? '是' : text == '0' ? '否' : '';
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
    onPageChange(page, pageSize) {
      this.pagination.current = page;
      this.pagination.pageSize = pageSize;
      this.query();
    },
    showSizeChange(current, size) {
      console.log('current=', current, 'size=', size);
      this.pageSize = size;
      this.query();
    },
    changePage(page, pageSize) {
      console.log('page=', page, 'pageSize=', pageSize);
      this.query();
    },
    init() {
      this.query();
    },
    query() {
      const that = this;
      listAppUpdate({ current: that.pagination.current, size: that.pagination.pageSize, ...that.form }).then((res) => {
        const r = res.data;
        if (r.code === 200) {
          const data = r.data;
          that.list = data.records;
          that.pagination = {
            current: parseInt(data.current),
            pageSize: parseInt(data.size),
            total: parseInt(data.total),
          };
        }
      });
    },
    addUI() {
      const that = this;
      that.$util.clearObject(that.updateUIForm, true);
      that.fileList = [];
      that.updateUIVisible = true;
    },
    updateUIOk() {
      const that = this;
      addAppUpdate({ ...that.updateUIForm }).then((res) => {
        const r = res.data;
        if (r.code !== 200) {
          return;
        }
        that.$message.success('操作成功', 1.5, () => {
          that.updateUIVisible = false;
          that.init();
        });
      });
    },
    del(record) {
      const that = this;
      delAppUpdate({ id: record.id }).then((res) => {
        const r = res.data;
        if (r.code !== 200) {
          return;
        }
        that.$message.success('操作成功', 1.5, () => {
          that.init();
        });
      });
    },
    forceChange(checked) {
      this.updateUIForm['force'] = checked ? 1 : 0;
    },
    pushChange(checked) {
      this.updateUIForm['push'] = checked ? 1 : 0;
    },
    push(record) {
      const that = this;
      pushStateAppUpdate({id: record.id, push: record.push == 1 ? 0 : 1}).then((res) => {
        const r = res.data;
        if (r.code != 200) {
          return;
        }
        that.$message.success('操作成功', 1.5, () => {
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
    beforeUpload(file, fileList) {
      this.fileList = fileList;
      return true;
    },
    customRequest(data) {
      const that = this;
      const file = data.file;
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
          }, (err) => {
            console.log("error", err.code, err.message, err.isRequestError);
          }, (completeRes) => {
            console.log("complete", completeRes);
            const url = host + "/" + completeRes.key;
            fetch(url + "?qhash/md5", {
              method: 'GET',
            }).then((res) => res.json()).then((res) => {
              const hash = res['hash'];
              const fsize = res['fsize'];
              that.uploadCallback(url, hash, fsize);
            });
          });
        });
      } else {
        console.error('没有选择文件');
      }
    },
    uploadCallback(url, hash, fsize) {
      this.updateUIForm.url = url;
      this.updateUIForm.hashValue = hash;
      this.updateUIForm.appSize = fsize;
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