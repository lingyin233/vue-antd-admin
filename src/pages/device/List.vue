<template>
  <div class="new-page" :style="`min-height: ${pageMinHeight}px`">
    <a-card>
      <a-space class="operator">
        <a-button type="primary" @click="$router.go(-1)">
          返回
        </a-button>
      </a-space>
      <a-table :data-source="list" :columns="columns" :row-key="record => record.id" :pagination="false">
        <template slot="action" slot-scope="text, record">
          <a-popconfirm title="确认解绑？" @confirm="unbind(record)">
            <a-button type="primary">解绑</a-button>
          </a-popconfirm>
        </template>
      </a-table>
    </a-card>
  </div>
</template>
    
<script>
import { mapState } from 'vuex';
import { listDevice, unbindDevice } from '@/services/device';
import { Modal } from 'ant-design-vue';
export default {
  name: 'DeviceList',
  data() {
    return {
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
          title: '产品',
          dataIndex: 'product',
          key: 'product',
        },
        {
          title: '序列号',
          dataIndex: 'serialNumber',
          key: 'serialNumber',
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'action' },
        }
      ],
      list: []
    };
  },
  methods: {
    changePage(page, pageSize) {
      console.log('page=', page, 'pageSize=', pageSize);
      this.queryDevice();
    },
    showSizeChange(current, size) {
      console.log('current=', current, 'size=', size);
      this.pageSize = size;
      this.queryDevice();
    },
    init() {
      this.queryDevice();
    },
    queryDevice() {
      listDevice({ userId: this.$route.query.userId, appId: this.$route.query.appId }).then((res) => {
        const r = res.data;
        const data = r.data;
        this.list = data.list;
      });
    },
    unbind(record) {
      const that = this;
      unbindDevice({
        appId: that.$route.query.appId,
        userId: that.$route.query.userId,
        serialNumber: record.serialNumber
      }).then((res) => {
        const r = res.data;
        that.$message.success('解绑成功', 1.5, function () {
          that.$router.push('/users/list');
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