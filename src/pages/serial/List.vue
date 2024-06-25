<template>
  <div class="new-page" :style="`min-height: ${pageMinHeight}px`">
    <a-card>
      <div class="search">
        <a-form layout="horizontal" :model="form">
          <a-row>
            <a-col :md="8" :sm="24">
              <a-form-item name="serialNumber" label="序列号" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-input v-model:value="form['serialNumber']" placeholder="请输入"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item name="createTime" label="创建时间" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-date-picker :disabled-date="disabledStartDate" show-time @change="startChange"
                  style="padding-right: 5px;" format="YYYY-MM-DD HH:mm:ss" placeholder="Start"
                  @openChange="handleStartOpenChange" />
                <a-date-picker :disabled-date="disabledEndDate" show-time @change="endChange" style="padding-right: 5px;"
                  format="YYYY-MM-DD HH:mm:ss" placeholder="End" :open="endOpen" @openChange="handleEndOpenChange" />
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
          <a-button type="primary" @click="addUI">生成序列号</a-button>
          <a-button type="primary" @click="exportUI">导出序列号</a-button>
          <a-input v-model:value="validForm['serialNumber']" placeholder="请输入"></a-input>
          <a-button type="primary" @click="validUI">校验序列号</a-button>
        </a-space>
        <standard-table :columns="columns" :dataSource="list" :row-key="record => record.id"
          :pagination="{ ...pagination, onChange: onPageChange }">
          <div slot="action" slot-scope="{text, record}">
            <a-popconfirm title="确认删除？" @confirm="del(record)" style="margin: 2px;">
              <a href="javascript:void(0);" type="primary">删除</a>
            </a-popconfirm>
          </div>
        </standard-table>
      </div>
    </a-card>
    <a-modal v-model="addUIVisible" title="生成序列号" @ok="addUIOk" :maskClosable="false">
      <a-form>
        <a-form-item name="company" label="公司编号" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
          <a-input v-model:value="addUIForm['company']" placeholder="请输入"></a-input>
        </a-form-item>
        <a-form-item name="product" label="产品编号" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
          <a-input v-model:value="addUIForm['product']" placeholder="请输入"></a-input>
        </a-form-item>
        <a-form-item name="num" label="生成数量" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
          <a-input v-model:value="addUIForm['count']" placeholder="请输入"></a-input>
        </a-form-item>
        <a-form-item name="num" label="选择企业" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
          <a-select v-model:value="addUIForm['companyId']" :options="companyList"></a-select>
        </a-form-item>
        <a-form-item name="num" label="选择企业产品型号" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
          <a-select v-model:value="addUIForm['equipmentGroupId']" :options="serialGroupList"></a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
      
<script>
import StandardTable from '@/components/table/StandardTable';
import { mapState } from 'vuex';
import { listSerial, exportSerialUrl, generateSerial, delSerial, validSerial } from '@/services/serial';
import { listCompany } from '@/services/company';
import { Modal } from 'ant-design-vue';
import moment from 'moment';

import { listSerialGroup } from '@/services/serialgroup';

export default {
  name: 'SerialList',
  components: { StandardTable },
  data() {
    return {
      validForm: {
        serialNumber: '',
      },
      addUIVisible: false,
      addUIForm: {
        company: '',
        product: '',
        count: '',
        companyId: '',
        equipment_group_id: '',
      },
      serialGroupList: [],
      companyList: [],
      companyListQuery: {
        current: 1,
        size: 200,
      },
      endOpen: false,
      form: {
        serialNumber: '',
        startTime: '',
        endTime: '',
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
          title: '厂商',
          dataIndex: 'company',
          key: 'company',
        },
        {
          title: '产品型号',
          dataIndex: 'product',
          key: 'product',
        },
        {
          title: '序列号',
          dataIndex: 'serialNumber',
          key: 'serialNumber',
        },
        {
          title: '公司ID',
          dataIndex: 'companyId',
          key: 'companyId',
        },
        {
          title: '设备分组ID',
          dataIndex: 'equipmentGroupId',
          key: 'equipmentGroupId',
        },
        {
          title: '状态',
          dataIndex: 'status',
          key: 'status',
          customRender: (text, row, index) => {
            return parseInt(text) > 0 ? '已被' + text + '台设备绑定' : '未绑定设备';
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
      listSerial({ current: that.pagination.current, size: that.pagination.pageSize, ...that.form }).then((res) => {
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
    validUI() {
      const that = this;
      if (!that.validForm.serialNumber || that.validForm.serialNumber.length != 15) {
        that.$message.error('序列号格式不正确');
        return;
      }
      validSerial({ ...that.validForm }).then((res) => {
        const r = res.data;
        if (r.code != 200) {
          return;
        }
        const data = r.data;
        if (data.valid == 0) {
          that.$message.success('序列号正确');
        } else if (data.valid == 1) {
          that.$message.error('序列号不正确');
        } else if (data.valid == 2) {
          that.$message.error('序列号未找到');
        }
      });
    },
    exportUI() {
      const that = this;
      window.open(exportSerialUrl({ ...that.form }));
    },
    addUI() {
      const that = this;
      that.queryCompanyList();
      that.addUIVisible = true;
    },
    addUIOk() {
      const that = this;
      generateSerial({ ...that.addUIForm }).then((res) => {
        const r = res.data;
        if (r.code !== 200) {
          return;
        }
        that.$message.success('操作成功', 1.5, () => {
          that.init();
          that.addUIVisible = false;
        });
      });
    },
    queryCompanyList() {
      const that = this;
      listCompany({ ...that.companyListQuery }).then((res) => {
        const r = res.data;
        if (r.code !== 200) {
          return;
        }
        that.companyList = [];
        that.companyList.push({
          value: 0,
          label: 'Obexx',
        });
        const data = r.data;
        const records = data.records;
        for (let idx in records) {
          let item = records[idx];
          that.companyList.push({
            value: item.id,
            label: item.name,
          });
        }
      });
    },
    disabledStartDate(startTime) {
      const endTime = this.addUIForm.endTime;
      if (!startTime || !endTime) {
        return false;
      }
      return startTime.valueOf() > endTime.valueOf();
    },
    disabledEndDate(endTime) {
      const startTime = this.addUIForm.startValue;
      if (!endTime || !startTime) {
        return false;
      }
      return startTime.valueOf() >= endTime.valueOf();
    },
    handleStartOpenChange(open) {
      if (!open) {
        this.endOpen = true;
      }
    },
    handleEndOpenChange(open) {
      this.endOpen = open;
    },
    startChange(m, date) {
      const that = this;
      console.log('start', m, date);
      that.form.startTime = (date ? moment(date).toDate().getTime() : '');
    },
    endChange(m, date) {
      const that = this;
      console.log('end', m, date);
      that.form.endTime = (date ? moment(date).toDate().getTime() : '');
    },
    del(record) {
      const that = this;
      delSerial({ id: record.id }).then((res) => {
        const r = res.data;
        if (r.code !== 200) {
          return;
        }
        that.$message.success('删除成功', 1, () => {
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
  },
  watch: {
    'addUIForm.companyId': function (newValue, oldValue) {
      const that = this;
      listSerialGroup({current: 1, size: 1000000, companyId: newValue}).then(res => {
        const r = res.data;
        if (r.code !== 200) {
          return;
        }
        const data = r.data;
        let list = [{
          value: '',
          label: '\u3000',
        }];
        for (var idx in data.records) {
          const item = data.records[idx];
          list.push({ key: item.id, title: item.groupName + " | " + item.groupCode + " | " + item.id });
        }
        that.serialGroupList = list;
      });
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