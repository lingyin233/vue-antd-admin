<template>
  <div class="new-page" :style="`min-height: ${pageMinHeight}px`">
    <a-card>
      <div class="search">
        <a-form layout="horizontal" :model="form">
          <a-row>
            <a-col :md="8" :sm="24">
              <a-form-item name="type" label="产品类型" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-select v-model:value="form['productType']" placeholder="请选择" :options="productTypeList">
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item name="name" label="序列号" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-input v-model:value="form['serialNumber']" placeholder="请输入"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item name="type" label="状态" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-select v-model:value="form['status']" placeholder="请选择" :options="statusList">
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
        <standard-table :columns="columns" :dataSource="list" :row-key="record => record.id"
          :pagination="{ ...pagination, onChange: onPageChange }">
          <div slot="productType" slot-scope="{text, record}">
            <span v-if="record.productType == 1">AI BOX</span>
          </div>
          <div slot="status" slot-scope="{text, record}">
            <a-tag color="#1890ff" v-if="record.status == 0">未处理</a-tag>
            <a-tag color="#52c41a" v-if="record.status == 1">已答复</a-tag>
          </div>
          <div slot="action" slot-scope="{text, record}">
            <a href="javascript:void(0);" type="primary" @click="updateUI(record)">回复</a>
          </div>
        </standard-table>
      </div>
    </a-card>
    <a-modal v-model="updateUIVisible" title="回复" @ok="updateUIOk">
      <a-form>
        <a-form-item name="id" label="ID" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
          <a-input v-model:value="updateUIForm['id']" disabled placeholder="请输入"></a-input>
        </a-form-item>
        <a-form-item name="productType" label="产品类型" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
          <a-select v-model:value="updateUIForm['productType']" disabled placeholder="请选择" :options="productTypeList">
          </a-select>
        </a-form-item>
        <a-form-item name="userId" label="用户ID" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
          <a-input v-model:value="updateUIForm['userId']" disabled placeholder="请输入"></a-input>
        </a-form-item>
        <a-form-item name="serialNumber" label="机器序列号" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
          <a-input v-model:value="updateUIForm['serialNumber']" disabled placeholder="请输入"></a-input>
        </a-form-item>
        <a-form-item name="contact" label="联系方式" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
          <a-input v-model:value="updateUIForm['contact']" disabled placeholder="请输入"></a-input>
        </a-form-item>
        <a-form-item name="attachments" label="附件" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
          <img :src="item.attachmentUrl" v-for="item in updateUIForm['attachments']" :key="item.id" style="width: 100px; height: 100px;"/>
        </a-form-item>
        <a-form-item name="question" label="问题意见" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
          <a-textarea v-model:value="updateUIForm['question']" disabled placeholder="请输入"></a-textarea>
        </a-form-item>
        <a-form-item name="reply" label="意见回复" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
          <a-textarea v-model:value="updateUIForm['reply']" placeholder="请输入"></a-textarea>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
      
<script>
import StandardTable from '@/components/table/StandardTable';
import { mapState } from 'vuex';
import { listFeedback, updateFeedback, listFeedbackAttachment } from '@/services/feedback';
import { Modal } from 'ant-design-vue';
import moment from 'moment';
export default {
  name: 'FeedbackList',
  components: { StandardTable },
  data() {
    return {
      updateUIVisible: false,
      updateUIForm: {
        id: '',
        productType: '',
        userId: '',
        serialNumber: '',
        contact: '',
        attachments: [],
        question: '',
        reply: '',
      },
      form: {
        productType: '',
        serialNumber: '',
        status: '',
      },
      productTypeList: [
        {
          value: 1,
          label: 'AIBOX'
        }
      ],
      statusList: [
        {
          value: 0,
          label: '未处理',
        },
        {
          value: 1,
          label: '已回复',
        }
      ],
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
          title: '产品类型',
          dataIndex: 'productType',
          key: 'productType',
          scopedSlots: { customRender: 'productType' },
        },
        {
          title: '用户ID',
          dataIndex: 'userId',
          key: 'userId',
        },
        {
          title: '机器序列号',
          dataIndex: 'serialNumber',
          key: 'serialNumber',
        },
        {
          title: '联系方式',
          dataIndex: 'contact',
          key: 'contact',
        },
        {
          title: '问题意见',
          dataIndex: 'question',
          key: 'question',
        },
        {
          title: '问题回复',
          dataIndex: 'reply',
          key: 'reply',
        },
        {
          title: '状态',
          dataIndex: 'status',
          key: 'status',
          scopedSlots: { customRender: 'status' },
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
      listFeedback({ current: that.pagination.current, size: that.pagination.pageSize, ...that.form }).then((res) => {
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
      listFeedbackAttachment({feedbackId: record.id}).then((res) => {
        const r = res.data;
        if (r.code !== 200) {
          return;
        }
        that.updateUIForm.attachments = r.data.list;
      });
      that.$util.extend(true, that.updateUIForm, record);
      that.updateUIVisible = true;
    },
    updateUIOk() {
      const that = this;
      updateFeedback({id: that.updateUIForm.id, reply: that.updateUIForm.reply}).then((res) => {
        const r = res.data;
        if (r.code !== 200) {
          return;
        }
        that.$message.success('回复成功', 1.5, () => {
          that.queryList();
          that.updateUIVisible = false;
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