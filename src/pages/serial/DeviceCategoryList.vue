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
          
          <div slot="icon" slot-scope="{text, record}">
            <img  v-if="record.icon"  style="width: 80px; height: 80px;" :src="record.icon" />
          </div>  
          <div slot="optUrl" slot-scope="{text, record}">
            <img  v-if="record.optUrl"  style="width: 80px; height: 80px;" :src="record.optUrl" />
          </div>
          <div slot="optGif" slot-scope="{text, record}">
             <img v-if="record.optGif" style="width: 80px; height: 80px;" :src="record.optGif" />
          </div> 
             <div slot="netType" slot-scope="{text}">
          <a-tag :color="text === '1' ? 'green' :text === '2' ? 'orange': 'red'">
           {{ text === '1' ? '蓝牙' : text === '2' ? '扫码' : text === '3'? '蓝牙+扫码':'未知' }}
          </a-tag>
          </div>      
           <div slot="status" slot-scope="{ text, record }">
            <a-switch :checked="record.status === 1" @change="() => status(record)"
                      checkedChildren="正常"
                      unCheckedChildren="删除">
            </a-switch>
          </div>  
          <div slot="action" slot-scope="{ text, record }">
             <div>
              <a href="javascript:void(0);" type="primary" @click="updateUI(record)" style="margin-right: 5px;">修改</a>
              <a
                href="javascript:void(0);"
                @click="i18nUI(record)"
                style="margin-right: 5px"
                >国际化</a >              
            </div>
          </div>    
        </standard-table>
      </div>
    </a-card>
    <a-modal v-model="updateUIVisible" title="添加或更新" @ok="saveAppearance" :maskClosable="false">
      <a-form>
        <a-form-item name="id" label="ID" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
          <a-input v-model:value="updateForm['id']" disabled placeholder="请输入"></a-input>
        </a-form-item>
        <a-form-item name="category" label="设备category" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
          <a-input v-model:value="updateForm.category" placeholder="请输入" />
        </a-form-item>
       <a-form-item name="icon" label=" 设备图标" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
          <a-input v-model:value="updateForm.icon"   disabled placeholder="请输入" />
          <a-upload accept="image/*" :file-list="fileListIcon" :data="{ type: 1 }" :remove="handleRemove"
            :before-upload="beforeUploadIcon" :customRequest="customRequest">
            <a-button> <a-icon type="upload" />点击上传图片</a-button>
          </a-upload>
          <span>{{ percent1 }}</span>
        </a-form-item>
        <a-form-item name="name" label="设备展示名称" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
          <a-input v-model:value="updateForm.name" ></a-input>
        </a-form-item>
        <a-form-item name="bleName" label="蓝牙搜索名称" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
          <a-input v-model:value="updateForm.bleName" ></a-input>
        </a-form-item>
         <a-form-item name="netType" label="配网类型" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
          <a-select v-model:value="updateForm.netType" placeholder="请选择" :options="netTypeList" ></a-select>
        </a-form-item>
        <a-form-item name="optUrl" label=" 配网页面的操作图" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
          <a-input v-model:value="updateForm.optUrl" disabled placeholder="请输入" />
          <a-upload accept="image/*" :file-list="fileListOptUrl" :data="{ type: 2 }" :remove="handleRemove"
            :before-upload="beforeUploadOptUrl" :customRequest="customRequest">
            <a-button> <a-icon type="upload" />点击上传图片</a-button>
          </a-upload>
          <span>{{ percent2 }}</span>
        </a-form-item>
        <a-form-item name="optGif" label="配网页面的gif" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
          <a-input v-model:value="updateForm.optGif" disabled placeholder="请输入" />
         <a-upload accept="image/*" :file-list="fileListOptGif" :data="{ type: 3 }" :remove="handleRemove"
            :before-upload="beforeUpload" :customRequest="customRequest">
            <a-button> <a-icon type="upload" />点击上传图片</a-button>
          </a-upload>
          <span>{{ percent3 }}</span>
        </a-form-item>
        <a-form-item name="status" label="状态" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
          <a-select v-model:value="updateForm['status']" placeholder="请选择" :options="statusList" >
          </a-select>
        </a-form-item>       
      </a-form>
    </a-modal>  
   <a-modal v-model="i18nUIVisible" title="国际化" @ok="i18nUIOk">
      <a-form>
        <a-form-item :wrapperCol="{ span: 18, offset: 6 }">
          <div style="color: red">* 选择需要国际化的语言以及表单字段</div>
        </a-form-item>
        <a-form-item
          name="lang"
          label="语言"
          :labelCol="{ span: 5 }"
          :wrapperCol="{ span: 18, offset: 1 }"
        >
          <a-select
            v-model:value="langSelect"
            @change="(option) => langChange(option)"
            labelInValue
          >
            <a-select-option value="">无</a-select-option>
            <a-select-option value="en_GB">英语-英国</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
      <a-form v-for="(item, index) in i18nUIForm['i18n']" :key="index">
        <div style="font-weight: bold">
          <span style="margin-right: 8px">{{ item["lang"] }}</span>
          <a-icon
            @click="langRemove(i18nUIForm, index)"
            class="dynamic-delete-button"
            type="minus-circle-o"
          />
        </div>
        <a-form-item
          style="display: none"
          name="lang"
          label="语言"
          :labelCol="{ span: 5 }"
          :wrapperCol="{ span: 18, offset: 1 }"
        >
          <a-input v-model:value="item['lang']"></a-input>
        </a-form-item>
        <a-form-item
          name="field"
          label="字段"
          :labelCol="{ span: 5 }"
          :wrapperCol="{ span: 18, offset: 1 }"
        >
          <a-select
            labelInValue
            @change="(option) => fieldChange(item, option)"
            :options="langFieldOptions"
          >
          </a-select>
        </a-form-item>
        <div v-for="(val, index) in item['kv']" :key="index">
          <a-form-item
            :name="val['key']"
            :label="val['label']"
            :labelCol="{ span: 5 }"
            :wrapperCol="{ span: 18, offset: 1 }"
          >
            <a-input
              :disabled="true"
              v-model:value="val['oldValue']"
              style="width: 30%; margin-right: 8px"
            ></a-input>
            <a-input
              v-model:value="val['value']"
              style="width: 58%; margin-right: 8px"
            ></a-input>
            <a-icon
              @click="fieldRemove(item, index)"
              class="dynamic-delete-button"
              type="minus-circle-o"
            />
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
import { listCategory, addOrUpdate,updateI18nDeviceCategory } from '@/services/deviceCategory';
import { qiniuUploadToken } from '@/services/common';
import * as qiniu from 'qiniu-js';
import { Modal } from 'ant-design-vue';
import moment from 'moment';
import category from '../../services/deviceCategory';
export default {
  name: 'DeviceCategoryList',
  components: { StandardTable, AppidSelect },
  data() {
    return {
      i18nUIVisible: false,
      i18nUIForm: {},
      langFieldOptions: [],
      langSelect: [],
      updateUIVisible: false,
      fileListIcon: [],
      fileListOptUrl: [],
      fileListOptGif:[],
      module: 'devicecategory',
      percent1: 0,
      percent2: 0,
      percent3: 0,
      updateForm: {
        id: '',
        category: '',
        icon: '',
        name: '',
        bleName: '',
        netType: '',
        optUrl: '',
        optGif: '',
        status:'',
        i18n:'',
      },
      form: {
        name: '',
        gender: '',
        type: '',
      },     
      statusList:[   
        {
          value: "1",
          label: "正常"
        },
        {
          value: "9",
          label: "删除"
        }
      ] ,
      netTypeList:[   
        {
          value: "1",
          label: "蓝牙"
        },
        {
          value: "2",
          label: "扫码"
        },
        {
          value: "3",
          label: "蓝牙+扫码"
        }
      ] ,
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
          title: '设备category',
          dataIndex: 'category',
          key: 'category',
        },
        {
          title: '设备图标',
          dataIndex: 'icon',
          key: 'icon',
          scopedSlots: { customRender: 'icon' },         
        },
        {
          title: '设备展示名称',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: '蓝牙搜索名称',
          dataIndex: 'bleName',
          key: 'bleName',         
        },
        {
          title: '配网类型',
          dataIndex: 'netType',
          key: 'netType',
          scopedSlots: { customRender: 'netType' }
        },
        {
          title: '配网页面的操作图',
          dataIndex: 'optUrl',
          key: 'optUrl',    
          scopedSlots: { customRender: 'optUrl' },       
        },
        {
          title: '配网页面的gif',
          dataIndex: 'optGif',
          key: 'optGif', 
          scopedSlots: { customRender: 'optGif' },        
        },
        {
          title: '状态',
          dataIndex: 'status',
          key: 'status',
          scopedSlots: { customRender: "status" },
        }, 
        {
          title: '操作',
          dataIndex: 'action',
          key: 'action',
          scopedSlots: { customRender: "action" },
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
      console.log("record", record);
      that.langFieldOptions = that.$util.filter(that.columns, (e) =>
        that.$util.contains(["name"], (e1) => e1 == e.key)
      );
      that.langSelect = "";
      // clear
      that.i18nUIForm = {};
      that.i18nUIVisible = true;
      that.i18nUIForm["id"] = record.id;
      that.i18nUIForm["record"] = record;
      let i18n = that.$util.isBlank(record.i18n) ? {} : JSON.parse(record.i18n);
      console.log("i18n", i18n);
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
      console.log("i18nUIForm", that.i18nUIForm);
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

      updateI18nDeviceCategory({
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
    queryAppearance() {
      const that = this;
      listCategory({ current: that.pagination.current, size: that.pagination.pageSize, ...that.form })
        .then((res) => {
          const r = res.data;          
          if (r.code !== 200) {
            this.$message.error(r.message || '请求失败');
            return;
          }
          
          // 处理国际化名称显示
          that.list = (Array.isArray(r.data) ? r.data : []).map(item => {
            // 解析i18n数据
            let i18nData = {};
            try {
              i18nData = item.i18n ? JSON.parse(item.i18n) : {};
            } catch (e) {
              console.error('解析i18n数据失败:', e);
            }
            
            // 根据当前语言显示对应的字段值
            const currentLang = this.$i18n.locale || 'zh';
            if (i18nData[currentLang]) {
              return {
                ...item,
                name: i18nData[currentLang].name || item.name,
                bleName: i18nData[currentLang].bleName || item.bleName
              };
            }
            return item;
          });
         
          that.pagination.total = that.list.length;
        });
    },
    del(record) {
      const that = this;
      addOrUpdate({ id: record.id }).then((res) => {
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
      this.updateForm.netType = '1';
      this.updateForm.status = '1';
    },
    updateUI(record, copy) {
      const that = this;
      this.$util.clearObject(this.updateForm, true);
      this.$util.extend(true, this.updateForm, record); 
      that.updateForm['status'] = that.updateForm['status'] + '';
      if (copy) {
        that.updateForm['id'] = '';
        that.updateForm['optUrl'] = '';
        that.updateForm['icon'] = '';
        that.updateForm['optGif'] = '';
        that.updateForm['status'] = '';
      }
      this.updateUIVisible = true;
    },
    saveAppearance() {
      const that = this;
      addOrUpdate({ ...that.updateForm }).then((res) => {
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
      console.log("handle remove file", newFileList);
    },
    beforeUploadIcon(file, fileList) {
      this.fileListIcon = fileList;
      return true;
    },
    beforeUploadOptUrl(file, fileList) {
      this.fileListOptUrl = fileList;
      return true;
    },
    beforeUpload(file, fileList) {
      this.fileListOptGif = fileList;
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
            }else if (type == 3) {
              that.percent3 = total.percent + "%";
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
      if (type === 1) {
        this.updateForm.icon = url; 
      } else if (type === 2) {
        this.updateForm.optUrl = url; 
      } else if (type === 3) {
        this.updateForm.optGif = url; 
      }
    },
    status(record) {
      const that = this;
      const newStatus = record.status == 1 ? 9 : 1; // 计算新状态
      addOrUpdate({
        id: record.id,
        category:record.category,
        icon:record.icon,
        name:record.name,
        bleName:record.bleName,
        netType:record.netType,
        optUrl:record.optUrl,        
        status:newStatus,
        i18n:record.i18n,        
      }).then((res) => {
        const r = res.data;
        if (r.code != 200) {
          return;
        }
        record.status = newStatus;
        that.$message.success("操作成功", 1.5, () => {          
        });
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