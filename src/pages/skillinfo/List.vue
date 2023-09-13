<template>
  <div class="new-page" :style="`min-height: ${pageMinHeight}px`">
    <a-card>
      <div class="search">
        <a-form layout="horizontal" :model="form">
          <a-row>
            <a-col :md="8" :sm="24">
              <a-form-item name="type" label="技能分组" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-select v-model:value="form['groupCode']" placeholder="请选择" :options="skillGroupList">
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <span style="margin-top: 3px;">
            <a-button type="primary" @click="queryList()">查询</a-button>
            <a-button style="margin-left: 8px" @click="$util.clearObject(form, true)">重置</a-button>
          </span>
        </a-form>
      </div>
      <div style="margin-top: 50px;">
        <a-space class="operator">
          <a-button type="primary" @click="addUI">添加</a-button>
        </a-space>
        <standard-table :columns="columns" :dataSource="list" :row-key="record => record.id"
          :pagination="{ ...pagination, onChange: onPageChange }">
          <div slot="skillIcon" slot-scope="{text, record}">
            <a-avatar size="large" :src="record.skillIcon"></a-avatar>
          </div>
          <div slot="action" slot-scope="{text, record}">
            <div><a href="javascript:void(0);" type="primary" @click="updateUI(record)" style="margin: 2px;">编辑</a></div>
            <div>
              <a-popconfirm title="确认删除？" @confirm="del(record)" style="margin: 2px;">
                <a href="javascript:void(0);" type="primary">删除</a>
              </a-popconfirm>
            </div>
            <div><a href="javascript:void(0);" type="primary" @click="updateGroupCodeUI(record)" style="margin: 2px;">更新分组</a></div>
          </div>
        </standard-table>
      </div>
    </a-card>
    <a-modal v-model="updateUIVisible" title="添加或更新" @ok="updateUIOk" :maskClosable="false">
      <a-form>
        <a-form-item name="id" label="ID" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
          <a-input v-model:value="updateUIForm['id']" disabled placeholder="请输入"></a-input>
        </a-form-item>
        <a-form-item name="skillName" label="技能名称" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
          <a-input v-model:value="updateUIForm['skillName']" placeholder="请输入"></a-input>
        </a-form-item>
        <a-form-item name="skillIcon" label="技能图标" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
          <a-input v-model:value="updateUIForm['skillIcon']" disabled placeholder="请输入"></a-input>
          <a-upload accept="image/*" :file-list="fileList" :remove="handleRemove" :before-upload="beforeUpload"
            :customRequest="customRequest">
            <a-button> <a-icon type="upload" />点击上传文件</a-button>
          </a-upload>
          <span>{{ percent }}</span>
        </a-form-item>
        <a-form-item name="skillShortDesc" label="技能简介" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
          <a-input v-model:value="updateUIForm['skillShortDesc']" placeholder="请输入"></a-input>
        </a-form-item>
        <a-form-item name="sample" label="技能示例" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
          <a-input v-model:value="updateUIForm['sample']" placeholder="请输入"></a-input>
        </a-form-item>
        <a-form-item name="skillFullDesc" label="技能详情" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
          <a-textarea v-model:value="updateUIForm['skillFullDesc']" placeholder="请输入"></a-textarea>
        </a-form-item>
      </a-form>
    </a-modal>
    <a-modal v-model="updateGroupCodeUIVisible" title="设置分组" @ok="updateGrouCodeUIOk" :maskClosable="false">
      <a-form>
        <a-form-item name="id" label="ID" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
          <a-input v-model:value="updateGroupCodeUIForm['id']" disabled placeholder="请输入"></a-input>
        </a-form-item>
        <a-form-item name="groupCode" label="技能分组" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
          <a-select v-model:value="updateGroupCodeUIForm['groupCode']" placeholder="请选择" :options="skillGroupList">
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
      
<script>
import StandardTable from '@/components/table/StandardTable';
import { mapState } from 'vuex';
import { listSkillinfo, addSkillinfo, delSkillinfo, updateSkillGroup, listSkillinfoGroup } from '@/services/skillinfo';
import { qiniuUploadToken } from '@/services/common';
import * as qiniu from 'qiniu-js';
import { Modal } from 'ant-design-vue';
import moment from 'moment';
export default {
  name: 'SkillinfoList',
  components: { StandardTable },
  data() {
    return {
      module: 'skillinfo2',
      fileList: [],
      percent: 0,
      updateGroupCodeUIVisible: false,
      updateGroupCodeUIForm: {
        id: '',
        groupCode: '',
      },
      updateUIVisible: false,
      updateUIForm: {
        id: '',
        skillName: '',
        skillIcon: '',
        skillShortDesc: '',
        sample: '',
        skillFullDesc: '',
      },
      form: {
        groupCode: '',
      },
      skillGroupList: [],
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
          title: '技能名称',
          dataIndex: 'skillName',
          key: 'skillName',
        },
        {
          title: '技能图标',
          dataIndex: 'skillIcon',
          key: 'skillIcon',
          scopedSlots: { customRender: 'skillIcon' },
        },
        {
          title: '技能简介',
          dataIndex: 'skillShortDesc',
          key: 'skillShortDesc',
        },
        {
          title: '技能示例',
          dataIndex: 'sample',
          key: 'sample',
        },
        {
          title: '技能详情',
          dataIndex: 'skillFullDesc',
          key: 'skillFullDesc',
        },
        {
          title: '技能分组',
          dataIndex: 'groupCode',
          key: 'groupCode',
          customRender: (text, row, index) => {
            if (text == null || '' === text) {
              return text;
            }
            var item = null;
            for (var idx in this.skillGroupList) {
              var sg = this.skillGroupList[idx];
              if (sg.value == text) {
                item = sg;
                break;
              }
            }
            if (item == null) {
              return text;
            }
            return item.label;
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
          width: 100,
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
            that.percent = total.percent + "%";
          }, (err) => {
            console.log("error", err.code, err.message, err.isRequestError);
          }, (completeRes) => {
            console.log("complete", completeRes);
            that.uploadCallback(host + "/" + completeRes.key);
          });
        });
      } else {
        console.error('没有选择文件');
      }
    },
    uploadCallback(url) {
      this.updateUIForm.skillIcon = url;
    },
    init() {
      this.querySearch();
      this.queryList();
    },
    querySearch() {
      const that = this;
      listSkillinfoGroup({ current: 1, size: 1000 }).then((res) => {
        const r = res.data;
        if (r.code !== 200) {
          return;
        }
        const data = r.data;
        that.skillGroupList = [{
          value: '',
          label: '\u3000',
        }];
        for (var i in data.records) {
          var item = data.records[i];
          that.skillGroupList.push({
            value: item['groupCode'],
            label: item['groupName'],
          });
        }
      });
    },
    queryList() {
      const that = this;
      listSkillinfo({ current: that.pagination.current, size: that.pagination.pageSize, ...that.form }).then((res) => {
        const r = res.data;
        if (r.code !== 200) {
          return;
        }
        const data = r.data;
        that.list = data.records;
        that.pagination = {
          current: parseInt(data.current),
          pageSize: parseInt(data.size),
          total: parseInt(data.total),
        };
      });
    },
    updateUI(record) {
      const that = this;
      that.$util.clearObject(that.updateUIForm, true);
      that.$util.extend(true, that.updateUIForm, record);
      that.updateUIVisible = true;
    },
    updateUIOk() {
      const that = this;
      addSkillinfo({ ...that.updateUIForm }).then((res) => {
        const r = res.data;
        if (r.code !== 200) {
          return;
        }
        that.$message.success('操作成功', 1.5, () => {
          that.init();
        });
      });
    },
    addUI() {
      const that = this;
      that.$util.clearObject(that.updateUIForm, true);
      that.updateUIVisible = true;
    },
    del(record) {
      const that = this;
      delSkillinfo({ id: record.id }).then((res) => {
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
    updateGroupCodeUI(record) {
      const that = this;
      that.updateGroupCodeUIForm['id'] = record.id;
      that.updateGroupCodeUIForm['groupCode'] = record.groupCode;
      that.updateGroupCodeUIVisible = true;
    },
    updateGrouCodeUIOk() {
      const that = this;
      updateSkillGroup({...that.updateGroupCodeUIForm}).then((res) => {
        const r = res.data;
        if (r.code !== 200) {
          return;
        }
        that.$message.success('操作成功', 1.5, () => {
          that.updateGroupCodeUIVisible = false;
          that.init();
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