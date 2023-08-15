<template>
  <div class="new-page" :style="`min-height: ${pageMinHeight}px`">
    <a-card>
      <div class="search">
        <a-form layout="horizontal" :model="form">
          <a-row>
            <a-col :md="8" :sm="24">
              <a-form-item name="name" label="名称" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-input v-model:value="form['name']" placeholder="请输入"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item name="gender" label="性别" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-select v-model:value="form['gender']" placeholder="请选择" :options="genderList">
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item name="type" label="类型" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-select v-model:value="form['type']" placeholder="请选择" :options="typeList">
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <span style="margin-top: 3px;">
            <a-button type="primary" @click="queryAppearance()">查询</a-button>
            <a-button style="margin-left: 8px" @click="resetForm()">重置</a-button>
          </span>
        </a-form>
      </div>
      <div style="margin-top: 50px;">
        <a-space class="operator">
          <a-button type="primary">
            <router-link :to="{ path: '/appearance/add' }">添加</router-link>
          </a-button>
        </a-space>
        <standard-table :columns="columns" :dataSource="list" :row-key="record => record.id"
          :pagination="{ ...pagination, onChange: onPageChange }">
          <div slot="gender" slot-scope="{text, record}">
            <span v-if="record.gender == 1">男</span>
            <span v-else-if="record.gender == 2">女</span>
          </div>
          <div slot="type" slot-scope="{text, record}">
            <span v-if="record.type == 0">默认</span>
          </div>
          <div slot="action" slot-scope="{text, record}">
            <a-popconfirm title="确认删除？" @confirm="del(record)">
              <a href="javascript:void(0);" type="primary">删除</a>
            </a-popconfirm>
          </div>
        </standard-table>
      </div>
    </a-card>
  </div>
</template>
      
<script>
import StandardTable from '@/components/table/StandardTable';
import { mapState } from 'vuex';
import { listAppearance, delAppearance } from '@/services/appearance';
import { Modal } from 'ant-design-vue';
import moment from 'moment';
export default {
  name: 'AppearanceList',
  components: { StandardTable },
  data() {
    return {
      form: {
        name: '',
        gender: '',
        type: '',
      },
      genderList: [
        {
          value: "",
          label: "请选择"
        },
        {
          value: "1",
          label: "男"
        },
        {
          value: "2",
          label: "女"
        }
      ],
      typeList: [
        {
          value: "",
          label: "请选择"
        },
        {
          value: "0",
          label: "默认"
        },
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
          title: '角色',
          dataIndex: 'roleId',
          key: 'roleId',
        },
        {
          title: '性别',
          dataIndex: 'gender',
          key: 'gender',
          scopedSlots: { customRender: 'gender' },
        },
        {
          title: '名称',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: '地址',
          dataIndex: 'infoUrl',
          key: 'infoUrl',
        },
        {
          title: '类型',
          dataIndex: 'type',
          key: 'type',
          scopedSlots: { customRender: 'type' },
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
    resetForm() {
      this.form = {
        name: '',
        gender: '',
        type: '',
      };
    },
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
    queryAppearance() {
      const that = this;
      listAppearance({ current: that.pagination.current, size: that.pagination.pageSize, ...that.form }).then((res) => {
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
    del(record) {
      const that = this;
      delAppearance({id: record.id}).then((res) => {
        const r = res.data;
        if (r.code !== 200) {
          return;
        }
        that.$message.success("删除成功", 1.5, () => {
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