<template>
  <div class="new-page" :style="`min-height: ${pageMinHeight}px`">
    <a-card title="轮播图列表">
      <div class="search">
        <a-form layout="horizontal">

        </a-form>
      </div>
      <div style="margin-top: 50px;">
        <a-space class="operator">
          <a-button type="primary">
            <a href="javascript:void(0);" @click="addUI()">添加</a>
          </a-button>
        </a-space>
        <a-table :columns="columns" :data-source="list" :rowKey="record => record.id"
          :pagination="{ ...pagination, onChange: onPageChange }">
          <div slot="imageUrl" slot-scope="text, record">
            <img :src="record.imageUrl" style="width: 100px; height: 100px;">
          </div>
          <div slot="linkUrl" slot-scope="text, record">
            <a v-if="record.linkUrl != null && record.linkUrl != ''" :href="record.linkUrl" target="_blank">链接</a>
          </div>
          <div slot="action" slot-scope="text, record">
            <a-tag color="blue" v-if="record.action == null || record.action == 0">无</a-tag>
            <a-tag color="blue" v-else-if="record.action == 1">HTTP链接</a-tag>
          </div>
          <div slot="status" slot-scope="text, record">
            <a-switch checked-children="上架" un-checked-children="下架" :defaultChecked="record.status == 0"
              @change="(checked, e) => onChangeStatus(checked, e, record)"></a-switch>
          </div>
          <div slot="op" slot-scope="text, record">
            <a href="javascript:void(0);" type="primary" style="margin-right: 10px;" @click="updateUI(record)">修改</a>
            <a-popconfirm title="确认删除？" @confirm="del(record)" style="margin-right: 10px;">
              <a href="javascript:void(0);" type="primary">删除</a>
            </a-popconfirm>
          </div>
        </a-table>
      </div>
    </a-card>
    <a-modal v-model="updateUIVisible" title="添加或更新" @ok="addUIOk" :maskClosable="false">
      <a-form>
        <a-form-item style="display: none;" name="ID" label="id" :labelCol="{ span: 5 }"
          :wrapperCol="{ span: 18, offset: 1 }">
          <a-input v-model:value="updateUIForm['id']" placeholder="请输入"></a-input>
        </a-form-item>
        <a-form-item name="title" label="标题" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
          <a-input v-model:value="updateUIForm['title']" placeholder="请输入"></a-input>
        </a-form-item>
        <a-form-item name="content" label="内容" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
          <a-input v-model:value="updateUIForm['content']" placeholder="请输入"></a-input>
        </a-form-item>
        <a-form-item name="imageUrl" label="图片地址" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
          <a-input v-model:value="updateUIForm['imageUrl']" placeholder="请输入"></a-input>
        </a-form-item>
        <a-form-item name="action" label="链接类型" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
          <a-select v-model:value="updateUIForm['action']">
            <a-select-option value="0">无</a-select-option>
            <a-select-option value="1">HTTP链接</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item name="linkUrl" label="链接地址" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
          <a-input v-model:value="updateUIForm['linkUrl']" placeholder="请输入"></a-input>
        </a-form-item>
        <a-form-item name="seq" label="顺序" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
          <a-input v-model:value="updateUIForm['seq']" placeholder="请输入"></a-input>
        </a-form-item>
        <a-form-item name="status" label="状态" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
          <a-select v-model:value="updateUIForm['status']" placeholder="请输入">
            <a-select-option value="0">上架</a-select-option>
            <a-select-option value="-1">下架</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
      
<script>
import { mapState } from 'vuex';
import { listCarousel, addCarousel, delCarousel } from '@/services/carousel';
import { Modal } from 'ant-design-vue';
import moment from 'moment';
export default {
  name: 'AppVersionList',
  components: {},
  data() {
    return {
      updateUIVisible: false,
      updateUIForm: {},
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
          title: '标题',
          dataIndex: 'title',
          key: 'title',
        },
        {
          title: '内容',
          dataIndex: 'content',
          key: 'content',
        },
        {
          title: '图片地址',
          dataIndex: 'imageUrl',
          key: 'imageUrl',
          scopedSlots: { customRender: 'imageUrl' },
        },
        {
          title: '链接地址',
          dataIndex: 'linkUrl',
          key: 'linkUrl',
          scopedSlots: { customRender: 'linkUrl' },
        },
        {
          title: '链接类型',
          dataIndex: 'action',
          key: 'action',
          scopedSlots: { customRender: 'action' },
        },
        {
          title: '顺序',
          dataIndex: 'seq',
          key: 'seq',
        },
        {
          title: '状态',
          dataIndex: 'status',
          key: 'status',
          scopedSlots: { customRender: 'status' },
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
          dataIndex: 'op',
          key: 'op',
          scopedSlots: { customRender: 'op' },
        }
      ]
    };
  },
  methods: {
    onPageChange(page, pageSize) {
      this.pagination.current = page;
      this.pagination.pageSize = pageSize;
      this.queryList();
    },
    init() {
      this.queryList();
    },
    queryList() {
      const that = this;
      listCarousel({ current: that.pagination.current, size: that.pagination.pageSize, ...that.form }).then((res) => {
        const r = res.data;
        if (r.code != 200) {
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
    addUI() {
      const that = this;
      that.$util.clearObject(that.updateUIForm, true);
      that.updateUIVisible = true;
    },
    updateUI(record) {
      const that = this;
      that.$util.clearObject(that.updateUIForm, true);
      that.$util.extend(that.updateUIForm, record);
      that.updateUIForm['status'] = that.updateUIForm['status'] + '';
      that.updateUIVisible = true;
    },
    addUIOk() {
      const that = this;
      addCarousel({ ...that.updateUIForm }).then((res) => {
        const r = res.data;
        if (r.code != 200) {
          return;
        }
        that.$message.success('操作成功');
        that.init();
      });
    },
    onChangeStatus(checked, e, record) {
      const that = this;
      if (checked) {
        record['status'] = 0;
      } else {
        record['status'] = -1;
      }
      addCarousel({ ...record }).then((res) => {
        const r = res.data;
        if (r.code != 200) {
          return;
        }
        that.$message.success('操作成功');
        that.init();
      });
    },
    del(record) {
      const that = this;
      delCarousel({id: record.id}).then((res) => {
        const r = res.data;
        if (r.code != 200) {
          return;
        }
        that.$message.success('操作成功');
        that.init();
      });
    },
  },
  mounted() {
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
  margin-bottom: 50px;
}

.operator {
  margin-bottom: 18px;
}
</style>