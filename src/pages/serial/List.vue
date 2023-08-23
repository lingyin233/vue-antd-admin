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
                <a-date-picker :disabled-date="disabledStartDate" show-time @change="startChange" style="padding-right: 5px;"
                  format="YYYY-MM-DD HH:mm:ss" placeholder="Start" @openChange="handleStartOpenChange" />
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
      </a-form>
    </a-modal>
  </div>
</template>
      
<script>
import StandardTable from '@/components/table/StandardTable';
import { mapState } from 'vuex';
import { listSerial, generateSerial, delSerial } from '@/services/serial';
import { Modal } from 'ant-design-vue';
import moment from 'moment';
export default {
  name: 'SerialList',
  components: { StandardTable },
  data() {
    return {
      addUIVisible: false,
      addUIForm: {
        company: '',
        product: '',
        count: '',
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
    addUI() {
      const that = this;
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
      delSerial({id: record.id}).then((res) => {
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