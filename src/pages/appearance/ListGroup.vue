<template>
  <div class="new-page" :style="`min-height: ${pageMinHeight}px`">
    <a-card>
      <div class="search">
      </div>
      <div style="margin-top: 50px;">
        <a-space class="operator">
          <a-button type="primary" @click="addUI">添加</a-button>
        </a-space>
        <standard-table :columns="columns" :dataSource="list" :row-key="record => record.id"
          :pagination="{ ...pagination, onChange: onPageChange }">
          <div slot="picUrl" slot-scope="{text, record}">
            <a-avatar :src="record.picUrl"></a-avatar>
          </div>
          <div slot="action" slot-scope="{text, record}">
            <a href="javascript:void(0);" type="primary" @click="updateUI(record)" style="margin-right: 5px;">编辑</a>
            <a-popconfirm title="确认删除？" @confirm="del(record)" style="margin-right: 5px;">
              <a href="javascript:void(0);" type="primary">删除</a>
            </a-popconfirm>
            <a href="javascript:void(0);" @click="i18nUI(record)" style="margin-right: 5px;">国际化</a>
            <a href="javascript:void(0);" @click="updateUI(record, true)" style="margin-right: 5px;">复制</a>
          </div>
        </standard-table>
      </div>
    </a-card>
    <a-modal v-model="updateUIVisible" title="添加或更新" @ok="updateUIOk" :maskClosable="false">
      <a-form>
        <a-form-item name="id" label="ID" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
          <a-input v-model:value="updateUIForm['id']" disabled placeholder="请输入"></a-input>
        </a-form-item>
        <a-form-item name="name" label="名称" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
          <a-input v-model:value="updateUIForm['name']" placeholder="请输入"></a-input>
        </a-form-item>
        <a-form-item name="summary" label="介绍" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
          <a-input v-model:value="updateUIForm['summary']" placeholder="请输入"></a-input>
        </a-form-item>
        <a-form-item name="picUrl" label="图片" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
          <a-input v-model:value="updateUIForm['picUrl']" disabled placeholder="请输入" />
          <a-upload accept="image/*" :file-list="fileList2" :data="{ type: 2 }" :remove="handleRemove"
            :before-upload="beforeUpload2" :customRequest="customRequest">
            <a-button> <a-icon type="upload" />点击上传图片</a-button>
          </a-upload>
          <span>{{ percent2 }}</span>
        </a-form-item>
        <a-form-item name="seq" label="顺序" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
          <a-input v-model:value="updateUIForm['seq']" placeholder="请输入"></a-input>
        </a-form-item>
        <a-form-item name="appId" label="appId" :labelCol="{ span: 5}" :wrapperCol="{ span: 18, offset: 1}">
          <appid-select v-model:value="updateUIForm['appId']"></appid-select>
        </a-form-item>
        <a-form-item name="gender" label="性别" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
          <a-select v-model:value="updateUIForm['gender']" placeholder="请输入" :options="genderOptions">
          </a-select>
        </a-form-item>
        <a-form-item name="deflt" label="是否默认" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
          <a-select v-model:value="updateUIForm['deflt']" placeholder="请输入" :options="defltOptions">
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
    <a-modal v-model="i18nUIVisible" title="国际化" @ok="i18nUIOk">
      <a-form>
        <a-form-item :wrapperCol="{ span: 18, offset: 6 }">
          <div style="color: red;">
            * 选择需要国际化的语言以及表单字段
          </div>
        </a-form-item>
        <a-form-item name="lang" label="语言" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
          <a-select v-model:value="langSelect" @change="(option) => langChange(option)" labelInValue>
            <a-select-option value="">无</a-select-option>
            <a-select-option value="en_GB">英语-英国</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
      <a-form v-for="(item, index) in i18nUIForm['i18n']" :key="index">
        <div style="font-weight: bold;">
          <span style="margin-right: 8px">{{ item['lang'] }}</span>
          <a-icon @click="langRemove(i18nUIForm, index)" class="dynamic-delete-button" type="minus-circle-o" />
        </div>
        <a-form-item style="display: none;" name="lang" label="语言" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
          <a-input v-model:value="item['lang']"></a-input>
        </a-form-item>
        <a-form-item name="field" label="字段" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
          <a-select labelInValue @change="(option) => fieldChange(item, option)" :options="langFieldOptions">
          </a-select>
        </a-form-item>
        <div v-for="(val, index) in item['kv']" :key="index">
          <a-form-item :name="val['key']" :label="val['label']" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
            <a-input :disabled="true" v-model:value="val['oldValue']" style="width: 30%; margin-right: 8px"></a-input>
            <a-input v-model:value="val['value']" style="width: 58%; margin-right: 8px"></a-input>
            <a-icon @click="fieldRemove(item, index)" class="dynamic-delete-button" type="minus-circle-o" />
          </a-form-item>
        </div>
      </a-form>
    </a-modal>
  </div>
</template>
      
<script>
import StandardTable from '@/components/table/StandardTable';
import AppidSelect from '@/components/obx/AppidSelect';
import { mapState } from 'vuex';
import { listAppearanceGroup, addAppearanceGroup, delAppearanceGroup, updateI18nAppearanceGroup } from '@/services/appearance';
import { qiniuUploadToken } from '@/services/common';
import * as qiniu from 'qiniu-js';
import { Modal } from 'ant-design-vue';
import moment from 'moment';
export default {
  name: 'AppearanceGroupList',
  components: { StandardTable, AppidSelect },
  data() {
    return {
      fileList2: [],
      module: 'appearance2',
      percent2: 0,
      i18nUIVisible: false,
      i18nUIForm: {},
      langFieldOptions: [],
      langSelect: '',
      updateUIVisible: false,
      updateUIForm: {
        id: '',
        name: '',
        summary: '',
        picUrl: '',
        seq: '',
        appId: '',
        gender: '',
        deflt: '',
      },
      defltOptions: [
        {
          label: '否',
          value: 0
        },
      ],
      genderOptions: [
        {
          label: '男',
          value: 1
        },
        {
          label: '女',
          value: 2
        },
        {
          label: '其他',
          value: 3
        },
      ],
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
          title: '名称',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: '介绍',
          dataIndex: 'summary',
          key: 'summary',
        },
        {
          title: '图片',
          dataIndex: 'picUrl',
          key: 'picUrl',
          scopedSlots: { customRender: 'picUrl' },
        },
        {
          title: '顺序',
          dataIndex: 'seq',
          key: 'seq',
        },
        {
          title: 'appid',
          dataIndex: 'appId',
          key: 'appId',
          customRender: (text, row, index) => {
            return text;
          }
        },
        {
          title: '性别',
          dataIndex: 'gender',
          key: 'gender',
          customRender: (text, row, index) => {
            return text == '1' ? '男' : text == '2' ? '女' : '未知';
          }
        },
        {
          title: '是否默认',
          dataIndex: 'deflt',
          key: 'deflt',
          customRender: (text, row, index) => {
            return text == 1 ? '是' : '否';
          }
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
          title: '更新时间',
          dataIndex: 'updateTime',
          key: 'updateTime',
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
      this.queryList();
    },
    showSizeChange(current, size) {
      console.log('current=', current, 'size=', size);
      this.pageSize = size;
      this.queryList();
    },
    changePage(page, pageSize) {
      console.log('page=', page, 'pageSize=', pageSize);
      this.queryList();
    },
    init() {
      this.queryList();
    },
    queryList() {
      const that = this;
      listAppearanceGroup({ current: that.pagination.current, size: that.pagination.pageSize, ...that.form }).then((res) => {
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
    updateUI(record, copy) {
      const that = this;
      that.$util.clearObject(that.updateUIForm, true);
      that.fileList = [];
      that.$util.extend(true, that.updateUIForm, record);
      if (copy) {
        that.updateUIForm['id'] = '';
      }
      that.updateUIVisible = true;
    },
    updateUIOk() {
      const that = this;
      console.log(that.updateUIForm);
      addAppearanceGroup({...that.updateUIForm}).then((res) => {
        const r = res.data;
        if (r.code !== 200) {
          return;
        }
        that.$message.success('操作成功', 1.5, () => {
          that.queryList();
          that.updateUIVisible = false;
          that.addUIVisible = false;
        });
      });
    },
    addUI() {
      const that = this;
      that.$util.clearObject(that.updateUIForm, true);
      that.fileList = [];
      that.updateUIVisible = true;
    },
    del(record) {
      const that = this;
      delAppearanceGroup({id: record.id}).then((res) => {
        const r = res.data;
        if (r.code !== 200) {
          return;
        }
        that.$message.success('操作成功', 1.5, () => {
          that.updateUIVisible = false;
          that.queryList();
        });
      });
    },
    i18nUI(record) {
      const that = this;
      console.log('record', record);
      that.langFieldOptions = that.$util.filter(that.columns, (e) => that.$util.contains(['name', 'summary'], (e1) => e1 == e.key));
      that.langSelect = '';

      // clear
      that.i18nUIForm = {};
      that.i18nUIVisible = true;
      that.i18nUIForm['id'] = record.id;
      that.i18nUIForm['record'] = record;
      let i18n = that.$util.isBlank(record.i18n) ? {} : JSON.parse(record.i18n);
      console.log('i18n', i18n);
      that.i18nUIForm['i18n'] = [];
      let columnsMap = {};
      for (let idx in that.columns) {
        let item = that.columns[idx];
        columnsMap[item['key']] = item;
      }
      for (let lang in i18n) {
        let data = {lang: lang, kv: []};
        for (let key in i18n[lang]) {
          data['kv'].push({label: columnsMap[key].title, oldValue: record[key], key: key, value: i18n[lang][key]});
        }
        that.i18nUIForm['i18n'].push(data);
      }
      console.log('i18nUIForm', that.i18nUIForm);
    },
    i18nUIOk() {
      const that = this;
      let data = {
        id: that.i18nUIForm['id'],
        i18n: {}
      };
      let i18n = that.i18nUIForm['i18n'];
      if (i18n.length == 0) {
        that.$message.warn('国际化字段为空');
        return;
      }
      for (let idx in i18n) {
        let item = i18n[idx];
        let kv = item.kv;
        data['i18n'][item['lang']] = {};
        for (let idx in kv) {
          if (kv[idx]['key']) {
            data['i18n'][item['lang']][kv[idx]['key']] = kv[idx]['value'];
          }
        }
      }
      console.log('data', data);
      updateI18nAppearanceGroup({id: data.id, i18n: JSON.stringify(data.i18n)}).then((res) => {
        const r = res.data;
        if (r.code != 200) {
          return;
        }
        that.$message.success('国际化设置成功');
        that.init();
        that.i18nUIVisible = false;
      });
    },
    langChange(option) {
      const that = this;
      if (option.key == '') {
        return;
      }
      let exist = false;
      for (let i in that.i18nUIForm['i18n']) {
        let item = that.i18nUIForm['i18n'][i];
        if (item['lang'] == option.key) {
          exist = true;
          break;
        }
      }
      if (!exist) {
        that.i18nUIForm['i18n'].push({
          lang: option.key, 
          kv: []
        });
      }
      that.$forceUpdate();
    },
    langRemove(i18nUIForm, index) {
      const that = this;
      i18nUIForm['i18n'].splice(index, 1);
      that.$forceUpdate();
    },
    fieldChange(item, option) {
      const that = this;
      console.log('item', item);
      if (that.$util.contains(item['kv'], (e) => e.key == option.key)) {
        return;
      }
      item['kv'].push({label: option.label, oldValue: that.i18nUIForm['record'][option.key], key: option.key, value: ''});
      that.$forceUpdate();
    },
    fieldRemove(item, index) {
      const that = this;
      item['kv'].splice(index, 1);
      that.$forceUpdate();
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