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
          <div slot="action" slot-scope="{text, record}">
            <a href="javascript:void(0);" type="primary" @click="updateUI(record)" style="margin-right: 5px;">编辑</a>
            <a-popconfirm title="确认删除？" @confirm="del(record)" style="margin-right: 5px;">
              <a href="javascript:void(0);" type="primary">删除</a>
            </a-popconfirm>
            <a href="javascript:void(0);" @click="i18nUI(record)">国际化</a>
          </div>
        </standard-table>
      </div>
    </a-card>
    <a-modal v-model="updateUIVisible" title="添加或更新" @ok="updateUIOk" :maskClosable="false">
      <a-form>
        <a-form-item name="id" label="ID" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
          <a-input v-model:value="updateUIForm['id']" disabled placeholder="请输入"></a-input>
        </a-form-item>
        <a-form-item name="groupCode" label="技能分组码" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
          <a-input v-model:value="updateUIForm['groupCode']" placeholder="请输入"></a-input>
        </a-form-item>
        <a-form-item name="groupName" label="技能分组简述" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
          <a-input v-model:value="updateUIForm['groupName']" placeholder="请输入"></a-input>
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
import { mapState } from 'vuex';
import { listSkillinfoGroup, addSkillinfoGroup, delSkillinfoGroup, updateI18nSkillinfoGroup } from '@/services/skillinfo';
import { Modal } from 'ant-design-vue';
import moment from 'moment';
export default {
  name: 'SkillinfoGroupList',
  components: { StandardTable },
  data() {
    return {
      i18nUIVisible: false,
      i18nUIForm: {},
      langFieldOptions: [],
      langSelect: '',
      updateUIVisible: false,
      updateUIForm: {
        id: '',
        groupCode: '',
        groupName: '',
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
          title: '技能分组码',
          dataIndex: 'groupCode',
          key: 'groupCode',
        },
        {
          title: '技能分组简述',
          dataIndex: 'groupName',
          key: 'groupName',
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
      listSkillinfoGroup({}).then((res) => {
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
    updateUI(record) {
      const that = this;
      that.$util.clearObject(that.updateUIForm, true);
      that.fileList = [];
      that.$util.extend(true, that.updateUIForm, record);
      that.updateUIVisible = true;
    },
    updateUIOk() {
      const that = this;
      addSkillinfoGroup({...that.updateUIForm}).then((res) => {
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
      delSkillinfoGroup({id: record.id}).then((res) => {
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
      that.langFieldOptions = that.$util.filter(that.columns, (e) => that.$util.contains(['groupName'], (e1) => e1 == e.key));
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
      updateI18nSkillinfoGroup({id: data.id, i18n: JSON.stringify(data.i18n)}).then((res) => {
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