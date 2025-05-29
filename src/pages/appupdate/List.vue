<template>
  <div class="new-page" :style="`min-height: ${pageMinHeight}px`">
    <a-card>
      <div class="search">
        <a-form layout="horizontal" :model="form">
          <a-row>
            <a-col :md="8" :sm="24">
              <a-form-item
                name="type"
                label="类型"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 1 }"
              >
                <a-select
                  v-model:value="form['type']"
                  placeholder="请选择"
                  :options="typeList"
                >
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item
                name="type"
                label="类型"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 1 }"
              >
                <company-select
                  v-model:value="form['companyId']"
                  placeholder="请选择"
                  :options="typeList"
                >
                </company-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item
                name="type"
                label="设备"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 1 }"
              >
                <a-select
                  v-model:value="form['deviceGroupId']"
                  :options="serialGroupListForm"
                ></a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <span style="margin-top: 3px">
            <a-button type="primary" @click="query()">查询</a-button>
            <a-button
              style="margin-left: 8px"
              @click="$util.clearObject(form, true)"
              >重置</a-button
            >
          </span>
        </a-form>
      </div>
      <div style="margin-top: 50px">
        <a-space class="operator">
          <a-button type="primary" @click="addUI()">添加</a-button>
        </a-space>
        <standard-table
          :columns="columns"
          :dataSource="list"
          :row-key="(record) => record.id"
          :pagination="{ ...pagination, onChange: onPageChange }"
        >
          <div slot="action" slot-scope="{ text, record }">
            <a-popconfirm
              title="确认删除？"
              @confirm="del(record)"
              style="margin: 2px"
            >
              <a href="javascript:void(0);" type="primary">删除</a>
            </a-popconfirm>
            <a
              v-if="record.push == 0"
              href="javascript:void(0);"
              @click="push(record)"
              >开启推送</a
            >
            <a v-else href="javascript:void(0);" @click="push(record)"
              >关闭推送</a
            >
            <div>
              <a
                href="javascript:void(0);"
                @click="i18nUI(record)"
                style="margin-right: 5px"
                >国际化</a
              >
            </div>
          </div>

          <div
            slot="expandedRowRender"
            slot-scope="{ text, record }"
            style="margin: 0"
          >
            <div>版本内容：{{ record.versionContent }}</div>
            <div>灰度配置：{{ record.grayReleaseJson }}</div>
            <div>下载地址：{{ record.url }}</div>
          </div>
        </standard-table>
      </div>
    </a-card>
    <a-modal
      v-model="updateUIVisible"
      title="添加或更新"
      @ok="updateUIOk"
      :maskClosable="false"
    >
      <a-form>
        <a-form-item
          name="id"
          label="ID"
          :labelCol="{ span: 5 }"
          :wrapperCol="{ span: 18, offset: 1 }"
        >
          <a-input
            v-model:value="updateUIForm['id']"
            disabled
            placeholder="请输入"
          ></a-input>
        </a-form-item>
        <a-form-item
          name="applicationId"
          label="应用ID"
          :labelCol="{ span: 5 }"
          :wrapperCol="{ span: 18, offset: 1 }"
        >
          <a-input
            v-model:value="updateUIForm['applicationId']"
            placeholder="请输入"
          ></a-input>
        </a-form-item>
        <a-form-item
          name="type"
          label="类型"
          :labelCol="{ span: 5 }"
          :wrapperCol="{ span: 18, offset: 1 }"
        >
          <a-select
            v-model:value="updateUIForm['type']"
            placeholder="请选择"
            :options="typeList"
            @change="changeType"
          >
          </a-select>
        </a-form-item>
        <a-form-item
          name="companyId"
          label="渠道"
          :labelCol="{ span: 5 }"
          :wrapperCol="{ span: 18, offset: 1 }"
          v-show="isDevice"
        >
          <company-select
            v-model:value="updateUIForm['companyId']"
            placeholder="请输入"
          ></company-select>
        </a-form-item>
        <a-form-item
          name="companyId"
          label="设备"
          :labelCol="{ span: 5 }"
          :wrapperCol="{ span: 18, offset: 1 }"
          v-show="isDevice"
        >
          <a-select
            v-model:value="updateUIForm['deviceGroupId']"
            :options="serialGroupList"
          ></a-select>
        </a-form-item>
        <a-form-item
          name="versionCode"
          label="整数版本号"
          :labelCol="{ span: 5 }"
          :wrapperCol="{ span: 18, offset: 1 }"
        >
          <a-input
            v-model:value="updateUIForm['versionCode']"
            placeholder="请输入"
          ></a-input>
        </a-form-item>
        <a-form-item
          name="versionName"
          label="版本名称"
          :labelCol="{ span: 5 }"
          :wrapperCol="{ span: 18, offset: 1 }"
        >
          <a-input
            v-model:value="updateUIForm['versionName']"
            placeholder="请输入"
          ></a-input>
        </a-form-item>
        <a-form-item
          name="versionContent"
          label="版本内容"
          :labelCol="{ span: 5 }"
          :wrapperCol="{ span: 18, offset: 1 }"
        >
          <a-textarea
            v-model:value="updateUIForm['versionContent']"
            placeholder="请输入"
          ></a-textarea>
        </a-form-item>
        <a-form-item
          name="url"
          label="文件"
          :labelCol="{ span: 5 }"
          :wrapperCol="{ span: 18, offset: 1 }"
        >
          <a-input
            v-model:value="updateUIForm['url']"
            disabled
            placeholder="请输入"
          ></a-input>
          <a-upload
            accept="*/*"
            :file-list="fileList"
            :remove="handleRemove"
            :before-upload="beforeUpload"
            :customRequest="customRequest"
          >
            <a-button> <a-icon type="upload" />点击上传文件</a-button>
          </a-upload>
          <span>{{ percent }}</span>
        </a-form-item>
        <a-form-item
          name="appSize"
          label="APP大小"
          :labelCol="{ span: 5 }"
          :wrapperCol="{ span: 18, offset: 1 }"
        >
          <a-input
            v-model:value="updateUIForm['appSize']"
            placeholder="请输入"
          ></a-input>
        </a-form-item>
        <a-form-item
          name="hashValue"
          label="APP MD5值"
          :labelCol="{ span: 5 }"
          :wrapperCol="{ span: 18, offset: 1 }"
        >
          <a-input
            v-model:value="updateUIForm['hashValue']"
            placeholder="请输入"
          ></a-input>
        </a-form-item>
        <a-form-item
          name="force"
          label="是否强制升级"
          :labelCol="{ span: 5 }"
          :wrapperCol="{ span: 18, offset: 1 }"
        >
          <a-switch @change="forceChange" />
        </a-form-item>
        <a-form-item
          name="push"
          label="是否推送"
          :labelCol="{ span: 5 }"
          :wrapperCol="{ span: 18, offset: 1 }"
        >
          <a-switch @change="pushChange" />
        </a-form-item>
        <a-form-item
          name="grayRelease"
          label="灰度"
          :labelCol="{ span: 5 }"
          :wrapperCol="{ span: 18, offset: 1 }"
        >
          <a-select
            v-model:value="updateUIForm['grayRelease']"
            placeholder="请选择"
            :options="grayReleaseList"
          >
          </a-select>
        </a-form-item>
        <a-form-item
          name="grayReleaseJson"
          label="灰度sn, userId"
          :labelCol="{ span: 5 }"
          :wrapperCol="{ span: 18, offset: 1 }"
        >
          <a-textarea
            v-model:value="updateUIForm['grayReleaseJson']"
            placeholder="请输入"
          >
          </a-textarea>
        </a-form-item>
        <a-form-item
          name="allowLowestVersion"
          label="允许最小版本"
          :labelCol="{ span: 5 }"
          :wrapperCol="{ span: 18, offset: 1 }"
        >
          <a-input
            v-model:value="updateUIForm['allowLowestVersion']"
            placeholder="请输入"
          ></a-input>
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
import StandardTable from "@/components/table/StandardTable";
import { mapState } from "vuex";
import { updateI18NAppUpdate } from "@/services/appupdate";
import AppidSelect from "@/components/obx/AppidSelect";
import {
  listAppUpdate,
  addAppUpdate,
  delAppUpdate,
  pushStateAppUpdate,
} from "@/services/appupdate";
import { qiniuUploadToken, qiniuUploadMd5 } from "@/services/common";
import * as qiniu from "qiniu-js";
import { Modal } from "ant-design-vue";
import moment from "moment";
import CompanySelect from "@/components/obx/CompanySelect";
import { listSerialGroup } from "@/services/serialgroup";

export default {
  name: "AppUpdateList",
  components: { StandardTable, CompanySelect },
  data() {
    return {
      i18nUIVisible: false,
      i18nUIForm: {},
      langFieldOptions: [],
      langSelect: "",
      module: "appupdate",
      fileList: [],
      percent: 0,
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
        force: 0,
        url: null,
        push: 0,
        grayRelease: 0,
        grayReleaseJson: '{"grayid": ""}',
        allowLowestVersion: 1,
      },
      grayReleaseList: [
        {
          label: "无",
          value: "0",
        },
        {
          label: "白名单",
          value: "1",
        },
        {
          label: "比例",
          value: "2",
        },
      ],
      typeList: [
        {
          label: "IOS",
          value: "IOS",
        },
        {
          label: "ANDROID",
          value: "ANDROID",
        },
        {
          label: "DEVICE",
          value: "DEVICE",
        },
      ],
      form: {
        type: "",
        companyId: "",
        deviceGroupId: "",
      },
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
      list: [],
      columns: [
        {
          title: "ID",
          dataIndex: "id",
          key: "id",
        },
        {
          title: "应用ID",
          dataIndex: "applicationId",
          key: "applicationId",
        },
        {
          title: "类型",
          dataIndex: "type",
          key: "type",
        },
        {
          title: "整数版本号",
          dataIndex: "versionCode",
          key: "versionCode",
        },
        {
          title: "版本名称",
          dataIndex: "versionName",
          key: "versionName",
        },
        {
          title: "版本内容",
          dataIndex: "versionContent",
          key: "versionContent",
          ellipsis: true,
        },
        {
          title: "大小",
          dataIndex: "appSize",
          key: "appSize",
        },
        {
          title: "hash",
          dataIndex: "hashValue",
          key: "hashValue",
        },
        {
          title: "是否强制升级",
          dataIndex: "force",
          key: "force",
          customRender: (text, row, index) => {
            return text == "1" ? "是" : text == "0" ? "否" : "";
          },
        },
        {
          title: "是否推送",
          dataIndex: "push",
          key: "push",
          customRender: (text, row, index) => {
            return text == "1" ? "是" : text == "0" ? "否" : "";
          },
        },
        {
          title: "灰度",
          dataIndex: "grayRelease",
          key: "grayRelease",
          ellipsis: true,
          customRender: (text, row, index) => {
            return text == "0" ? "无" : text == "1" ? "白名单" : text == "2" ? "比例" : "";
          },
        },
        {
          title: "灰度配置",
          dataIndex: "grayReleaseJson",
          key: "grayReleaseJson",
        },
        {
          title: "渠道",
          dataIndex: "companyName",
          key: "companyName",
        },
        {
          title: "设备",
          dataIndex: "deviceGroupName",
          key: "deviceGroupName",
        },
        {
          title: "创建时间",
          dataIndex: "createTime",
          key: "createTime",
          customRender: (text, row, index) => {
            return moment(text).format("YYYY-MM-DD HH:mm");
          },
        },
        {
          title: "操作",
          dataIndex: "action",
          key: "action",
          scopedSlots: { customRender: "action" },
        },
      ],
      isDevice: false,
      serialGroupList: [],
      serialGroupListForm: [],
    };
  },
  methods: {
    onPageChange(page, pageSize) {
      this.pagination.current = page;
      this.pagination.pageSize = pageSize;
      this.query();
    },
    i18nUI(record) {
      const that = this;
      console.log("record", record);
      that.langFieldOptions = that.$util.filter(that.columns, (e) =>
        that.$util.contains(["versionContent"], (e1) => e1 == e.key)
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
        id: that.i18nUIForm["id"],
        i18n: {},
      };
      let i18n = that.i18nUIForm["i18n"];
      if (i18n.length == 0) {
        that.$message.warn("国际化字段为空");
        return;
      }
      for (let idx in i18n) {
        let item = i18n[idx];
        let kv = item.kv;
        data["i18n"][item["lang"]] = {};
        for (let idx in kv) {
          if (kv[idx]["key"]) {
            data["i18n"][item["lang"]][kv[idx]["key"]] = kv[idx]["value"];
          }
        }
      }
      console.log("data", data);
      updateI18NAppUpdate({
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
    showSizeChange(current, size) {
      console.log("current=", current, "size=", size);
      this.pageSize = size;
      this.query();
    },
    changePage(page, pageSize) {
      console.log("page=", page, "pageSize=", pageSize);
      this.query();
    },
    init() {
      this.query();
    },
    query() {
      const that = this;
      listAppUpdate({
        current: that.pagination.current,
        size: that.pagination.pageSize,
        ...that.form,
      }).then((res) => {
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
      // 设置默认值
      that.updateUIForm.force = 0;
      that.updateUIForm.push = 0;
      that.updateUIForm.grayRelease = "0";
      that.updateUIForm.grayReleaseJson = '{"grayid": ""}';
      that.updateUIForm.allowLowestVersion = 1;
      that.fileList = [];
      that.updateUIVisible = true;
    },
    updateUIOk() {
      const that = this;
      if (that.updateUIForm["type"] == "DEVICE") {
        if (
          that.$util.isBlank(that.updateUIForm["companyId"]) ||
          that.$util.isBlank(that.updateUIForm["deviceGroupId"])
        ) {
          that.$message.error("请选择渠道和设备");
          return;
        }
      }
      addAppUpdate({ ...that.updateUIForm }).then((res) => {
        const r = res.data;
        if (r.code !== 200) {
          return;
        }
        that.$message.success("操作成功", 1.5, () => {
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
        that.$message.success("操作成功", 1.5, () => {
          that.init();
        });
      });
    },
    forceChange(checked) {
      this.updateUIForm["force"] = checked ? 1 : 0;
    },
    pushChange(checked) {
      this.updateUIForm["push"] = checked ? 1 : 0;
    },
    push(record) {
      const that = this;
      pushStateAppUpdate({
        id: record.id,
        push: record.push == 1 ? 0 : 1,
      }).then((res) => {
        const r = res.data;
        if (r.code != 200) {
          return;
        }
        that.$message.success("操作成功", 1.5, () => {
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
          const subscription = observable.subscribe(
            (nextRes) => {
              const total = nextRes.total;
              console.log("next", total.loaded, total.total, total.percent);
              that.percent = total.percent + "%";
            },
            (err) => {
              console.log("error", err.code, err.message, err.isRequestError);
            },
            (completeRes) => {
              console.log("complete", completeRes);
              const url = host + "/" + completeRes.key;
              qiniuUploadMd5({ url: url + "?qhash/md5" }).then((res) => {
                const r = res.data;
                if (r.code !== 200) {
                  return;
                }
                const data = JSON.parse(r.data);
                const hash = data["hash"];
                const fsize = data["fsize"];
                that.uploadCallback(url, hash, fsize);
              });
            }
          );
        });
      } else {
        console.error("没有选择文件");
      }
    },
    uploadCallback(url, hash, fsize) {
      this.updateUIForm.url = url;
      this.updateUIForm.hashValue = hash;
      this.updateUIForm.appSize = fsize;
    },
    changeType(value, option) {
      console.log("changeType:", value);
      this.isDevice = value == "DEVICE";
    },
    queryDeviceGroup(companyId, callback) {
      const that = this;
      listSerialGroup({ current: 1, size: 1000000, companyId: companyId }).then(
        (res) => {
          const r = res.data;
          if (r.code !== 200) {
            return;
          }
          const data = r.data;
          let list = [
            {
              value: "",
              label: "\u3000",
            },
          ];
          for (var idx in data.records) {
            const item = data.records[idx];
            list.push({
              key: item.id,
              title: item.groupName + " | " + item.groupCode + " | " + item.id,
            });
          }
          if (callback) callback(list);
        }
      );
    },
  },
  created() {
    this.init();
  },
  computed: {
    ...mapState("setting", ["pageMinHeight"]),
    desc() {
      return this.$t("description");
    },
  },
  watch: {
    "updateUIForm.companyId": function (newValue, oldValue) {
      console.log("companyId:", newValue);
      const that = this;
      this.queryDeviceGroup(newValue, (list) => {
        that.serialGroupList = list;
      });
    },
    "form.companyId": function (newValue, oldValue) {
      console.log("companyId:", newValue);
      const that = this;
      this.queryDeviceGroup(newValue, (list) => {
        that.serialGroupListForm = list;
      });
    },
  },
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