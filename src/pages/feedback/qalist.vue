<template>
  <div class="new-page" :style="`min-height: ${pageMinHeight}px`">
    <a-card>
      <div style="margin-top: 50px;">
        <a-space class="operator">
          <a-button type="primary" @click="addUI">
            添加
          </a-button>
        </a-space>
        <standard-table :columns="columns" :dataSource="list" :row-key="record => record.id"
          :pagination="{ ...pagination, onChange: onPageChange }">

          <div slot="action" slot-scope="{ text, record }">
            <div>
              <a href="javascript:void(0);" type="primary" @click="updateUI(record)" style="margin-right: 5px;">修改</a>
              <a-popconfirm title="确认删除？" @confirm="del(record)" style="margin-right: 5px;">
                <a href="javascript:void(0);" type="primary">删除</a>
              </a-popconfirm>
            </div>
            <div>
              <a href="javascript:void(0);" @click="i18nUI(record)" style="margin-right: 5px">国际化</a>
            </div>
          </div>
          <div slot="expandedRowRender" slot-scope="{ text, record }"
            style="margin: 0; padding: 10px; background: #fafafa;">
            <div v-if="record.parsedI18n && Object.keys(record.parsedI18n).length > 0">
              <div v-for="(content, lang) in record.parsedI18n" :key="lang">
                <div style="display: flex; margin-bottom: 8px;">
                  <div style="font-weight: bold;">国际化：语言：{{ lang }}</div>
                </div>
                <div style="display: flex; flex-direction: column; margin-left: 27px;">
                  <div style="display: flex; margin-bottom: 4px;">
                    <div style="width: 40px; text-align: right; margin-right: 8px;">q:</div>
                    <div style="flex: 1;">{{ content.q || '无' }}</div>
                  </div>
                  <div style="display: flex;">
                    <div style="width: 40px; text-align: right; margin-right: 8px;">a:</div>
                    <div style="flex: 1; white-space: pre-line;">{{ content.a || '无' }}</div>
                  </div>
                </div>
                <a-divider style="margin: 12px 0;" />
              </div>
            </div>
            <div v-else style="color: #999;">
              暂无国际化内容
            </div>
          </div>
        </standard-table>
      </div>
    </a-card>
    <a-modal v-model="updateUIVisible" title="添加或更新" @ok="saveFaq" :maskClosable="false">
      <a-form>
        <a-form-item name="id" label="ID" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
          <a-input v-model:value="updateForm['id']" disabled placeholder="请输入"></a-input>
        </a-form-item>
        <a-form-item name="q" label="问题" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
          <a-input v-model:value="updateForm['q']"></a-input>
        </a-form-item>
        <a-form-item name="a" label="问题回答" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
          <a-input v-model:value="updateForm['a']" :autoSize="{ minRows: 1, maxRows: 10 }" type="textarea"></a-input>
        </a-form-item>
        <a-form-item name="appId" label="APPID" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
          <appid-select :value="updateForm.appId" @newValue="handleAppIdChange" placeholder="请输入"></appid-select>
        </a-form-item>
      </a-form>
    </a-modal>
    <a-modal v-model="i18nUIVisible" title="国际化" @ok="i18nUIOk">
      <a-form>
        <a-form-item :wrapperCol="{ span: 18, offset: 6 }">
          <div style="color: red">* 选择需要国际化的语言以及表单字段</div>
        </a-form-item>
        <a-form-item name="lang" label="语言" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
          <a-select v-model:value="langSelect" @change="(option) => langChange(option)" labelInValue>
            <a-select-option value="">无</a-select-option>
            <a-select-option value="en_GB">英语-英国</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
      <a-form v-for="(item, index) in i18nUIForm['i18n']" :key="index">
        <div style="font-weight: bold">
          <span style="margin-right: 8px">{{ item["lang"] }}</span>
          <a-icon @click="langRemove(i18nUIForm, index)" class="dynamic-delete-button" type="minus-circle-o" />
        </div>
        <a-form-item style="display: none" name="lang" label="语言" :labelCol="{ span: 5 }"
          :wrapperCol="{ span: 18, offset: 1 }">
          <a-input v-model:value="item['lang']"></a-input>
        </a-form-item>
        <a-form-item name="field" label="字段" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
          <a-select labelInValue @change="(option) => fieldChange(item, option)" :options="langFieldOptions">
          </a-select>
        </a-form-item>
        <div v-for="(val, index) in item['kv']" :key="index">
          <a-form-item :name="val['key']" :label="val['label']" :labelCol="{ span: 5 }"
            :wrapperCol="{ span: 18, offset: 1 }">
            <a-input :disabled="true" v-model:value="val['oldValue']" style="width: 30%; margin-right: 8px"
              :autoSize="{ minRows: 1, maxRows: 10 }" type="textarea"></a-input>
            <a-input v-model:value="val['value']" style="width: 58%; margin-right: 8px"
              :autoSize="{ minRows: 1, maxRows: 10 }" type="textarea"></a-input>
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
import { listFaq, delFaq,faqAddOrUpdate,updateI18nFAQ ,} from '@/services/faqlist';
import moment from 'moment';
export default {
  name: 'qalist',
  components: { StandardTable, AppidSelect },
  data() {
    return {
      i18nUIVisible: false,
      i18nUIForm: {},
      langFieldOptions: [],
      langSelect: [],
      updateUIVisible: false,         
      module: 'faqlist',
      updateForm: {
        id: '',       
        i18n:'',
        appId: '',
        q:'',
        a:'',        
      },
      form: {
        name: '',
        gender: '',
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
          title: '问题',
          dataIndex: 'q',
          key: 'q',
        },
        {
          title: '问题回答',
          dataIndex: 'a',
          key: 'a',
        },
        {
          title: 'APPID',
          dataIndex: 'appId',
          key: 'appId',
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
          width: 100,
        },           
      ]
    };
  },
  methods: {
    onPageChange(page, pageSize) {
      this.pagination.current = page;
      this.pagination.pageSize = pageSize;
      this.queryFaq();
    },
    showSizeChange(current, size) {
      console.log('current=', current, 'size=', size);
      this.pageSize = size;
      this.queryFaq();
    },
    changePage(page, pageSize) {
      console.log('page=', page, 'pageSize=', pageSize);
      this.queryFaq();
    },
    init() {
      this.queryFaq();
    },
    langChange(option) {
      const that = this;
      if (option.key == "") {
        return;
      }
      let exist = false;
      for (let i in that.i18nUIForm["i18n"]) {
        let item = that.i18nUIForm["i18n"][i];
        if (item["lang"] == option.key) {
          exist = true;
          break;
        }
      }
      if (!exist) {
        that.i18nUIForm["i18n"].push({
          lang: option.key,
          kv: [],
        });
      }
      that.$forceUpdate();
    },
    langRemove(i18nUIForm, index) {
      const that = this;
      i18nUIForm["i18n"].splice(index, 1);
      that.$forceUpdate();
    },
    fieldChange(item, option) {
      const that = this;
      console.log("item", item);
      if (that.$util.contains(item["kv"], (e) => e.key == option.key)) {
        return;
      }
      item["kv"].push({
        label: option.label,
        oldValue: that.i18nUIForm["record"][option.key],
        key: option.key,
        value: "",
      });
      that.$forceUpdate();
    },
    fieldRemove(item, index) {
      const that = this;
      item["kv"].splice(index, 1);
      that.$forceUpdate();
    },
    i18nUI(record) {
      const that = this;      
      that.langFieldOptions = that.$util.filter(that.columns, (e) =>
        that.$util.contains(["q","a"], (e1) => e1 == e.key)
      );
      that.langSelect = "";
      // clear
      that.i18nUIForm = {};
      that.i18nUIVisible = true;
      that.i18nUIForm["id"] = record.id;
      that.i18nUIForm["record"] = record;
      let i18n = that.$util.isBlank(record.i18n) ? {} : JSON.parse(record.i18n);    
      that.i18nUIForm["i18n"] = [];
      let columnsMap = {};
      for (let idx in that.columns) {
        let item = that.columns[idx];
        columnsMap[item["key"]] = item;
      }
      for (let lang in i18n) {
        let data = { lang: lang, kv: [] };
        for (let key in i18n[lang]) {
          data["kv"].push({
            label: columnsMap[key].title,
            oldValue: record[key],
            key: key,
            value: i18n[lang][key],
          });
        }
        that.i18nUIForm["i18n"].push(data);
      }      
    },

    i18nUIOk() {
      const that = this;
      let data = {
        ...that.i18nUIForm.record, // 复制 record 的所有字段
        id: that.i18nUIForm["id"],
        i18n: {}, // 确保初始化为空对象
      };

      let i18n = that.i18nUIForm["i18n"];
      if (!i18n || i18n.length === 0) {
        that.$message.warn("国际化字段为空");
        return;
      }

      // 确保 data.i18n 是对象
      if (typeof data.i18n !== "object" || data.i18n === null) {
        data.i18n = {};
      }

      for (let idx in i18n) {
        let item = i18n[idx];
        let kv = item.kv;
        if (!item.lang) continue; // 确保 lang 存在

        // 初始化当前语言的对象
        data.i18n[item.lang] = {};

        for (let idx in kv) {
          if (kv[idx]["key"]) {
            data.i18n[item.lang][kv[idx]["key"]] = kv[idx]["value"];
          }
        }
      }
      updateI18nFAQ({
        ...that.i18nUIForm.record,
        id: data.id,
        i18n: JSON.stringify(data.i18n),
      }).then((res) => {
        const r = res.data;
        if (r.code != 200) {
          return;
        }
        that.$message.success("国际化设置成功");
        that.init();
        that.i18nUIVisible = false;
      });
    },
    queryFaq() {
      const that = this;
      listFaq({ current: that.pagination.current, size: that.pagination.pageSize, ...that.form })
        .then((res) => {          
          const r = res.data;          
          if (r.code !== 200) {
            this.$message.error(r.message || '请求失败');
            return;
          }
          
          // 处理国际化名称显示
          that.list = (Array.isArray(r.data?.list) ? r.data.list: []).map(item => {                
            const newItem = { ...item };              
            that.$set(newItem, 'parsedI18n', {});
        
            try {
              if (item.i18n) {
                newItem.parsedI18n = JSON.parse(item.i18n);
              }
            } catch (e) {
              console.error('解析i18n失败:', e);
            }
        
            return newItem;
          });
     
          that.pagination.total = r.data?.total || that.list.length;
        });
    },
    del(record) {
      const that = this;
      delFaq({ id: record.id }).then((res) => {
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
      this.updateUIVisible = true;        
    },
    updateUI(record, copy) {
      const that = this;
      this.$util.clearObject(this.updateForm, true);
      this.$util.extend(true, this.updateForm, record);       
      if (copy) {
        that.updateForm['id'] = '';
        that.updateForm['q'] = '';
        that.updateForm['a'] = ''; 
        that.updateForm['appId'] = '';      
      }
      this.updateUIVisible = true;
    },
    saveFaq() {      
      const that = this;
      const submitData = {
        id: this.updateForm.id,
        q: this.updateForm.q,
        a: this.updateForm.a,
        appId: this.updateForm.appId, 
        i18n: this.updateForm.i18n
      };    
      faqAddOrUpdate(submitData).then((res) => {
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
    handleCancel() {
    // 1. 关闭弹窗
      this.i18nVisible = false;
    
      // 2. 强制清除异常焦点
      this.$nextTick(() => {
        const activeElement = document.activeElement;
        if (activeElement && activeElement.blur) {
          activeElement.blur();
        }
      
        // 3. 将焦点返回到合理位置
        document.body.focus();
      });
    },  
    handleRemove(file) {
      const index = this.fileList.indexOf(file);
      const newFileList = this.fileList.slice();
      newFileList.splice(index, 1);
      this.fileList = newFileList;      
    },  
    handleAppIdChange(newAppId) {
      this.updateForm.appId = newAppId;
    },  
  },
  created() {
    this.init();
  },
  computed: {
    ...mapState('setting', ['pageMinHeight']),
    desc() {
      return this.$t('description');
    },
    currentLangLabel() {
      const lang = this.supportedLanguages.find(item => item.value === this.currentLang);
      return lang ? lang.label : '';
    }
  }
};
</script>
      
<style scoped lang="less">
@import "index";

.operator {
  margin-bottom: 18px;
}
</style>