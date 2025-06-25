<template>
  <div class="new-page" :style="`min-height: ${pageMinHeight}px`">
    <a-card>
      <div class="search">
        <a-form layout="horizontal" :model="form">
          <a-row>
            <a-col :md="8" :sm="24">
              <a-form-item
                name="uniqueId"
                label="唯一ID"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 1 }"
              >
                <a-input
                  v-model:value="form['uniqueId']"
                  placeholder="请输入"
                ></a-input>
              </a-form-item>
              <a-form-item
                name="fromName"
                label="来源名称"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 1 }"
              >
                <a-input
                  v-model:value="form['fromName']"
                  placeholder="请输入"
                ></a-input>
              </a-form-item>
            </a-col>
          </a-row>
          <span style="margin-top: 3px">
            <a-button type="primary" @click="queryList()">查询</a-button>
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
          <a-button type="primary" @click="addUI">添加</a-button>
        </a-space>

        <a-table
           v-show="true" 
          :columns="columns"
          :data-source="list"
          :rowKey="(record) => record.id"
          :pagination="{ ...pagination, onChange: onPageChange }"
        >
          <div slot="status" slot-scope="text, record">
            <a-switch
              :checked="record.status != 1"
              @change="() => pushStatus(record)"
              checked-children="启用"
              un-checked-children="禁用"
            />
          </div>
        </a-table>
      </div>
    </a-card>
    <a-modal
      v-model="addUIVisible"
      title="添加或更新"
      @ok="addUIOk"
      :maskClosable="false"
    >
      <a-form>
        <a-form-item
          name="uniqueId"
          label="唯一ID"
          :labelCol="{ span: 5 }"
          :wrapperCol="{ span: 18, offset: 1 }"
        >
          <a-input
            v-model:value="addUIForm['uniqueId']"
            placeholder="请输入"
          ></a-input>
        </a-form-item>
        <a-form-item
          name="fromName"
          label="来源名称"
          :labelCol="{ span: 5 }"
          :wrapperCol="{ span: 18, offset: 1 }"
        >
          <a-input
            v-model:value="addUIForm['fromName']"
            placeholder="请输入"
          ></a-input>
        </a-form-item>
        <a-form-item
          name="status"
          label="状态"
          :labelCol="{ span: 5 }"
          :wrapperCol="{ span: 18, offset: 1 }"
        >
          <a-switch
            @change="stateChange"
            checked-children="启用"
            un-checked-children="禁用"
            default-checked
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
import { mapState } from "vuex";
import {
  otherDeviceAdd,
  otherDeviceList,
  otherDeviceUpdateStatus,
} from "@/services/other";
import { Modal } from "ant-design-vue";
import moment from "moment";
export default {
  name: "deviceList",
  data() {
    return {
      addUIVisible: false,
      addUIForm: {
        uniqueId: null,
        fromName: null,
        status: 0,
      },
      endOpen: false,
      form: {
        uniqueId: "",
        fromName: "",
        status: 0,
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
          width: 80,
        },
        {
          title: "唯一ID",
          dataIndex: "uniqueId", 
          key: "uniqueId",
          width: 80,
        },
        {
          title: "来源名称",
          dataIndex: "fromName",
          key: "fromName",
          width: 80,
        },
        {
          title: "状态",
          dataIndex: "status",
          key: "status",
          width: 80,
          scopedSlots: { customRender: "status" },
        },
        {
          title: "创建时间",
          dataIndex: "createTime",
          key: "createTime",
          width: 80,
          customRender: (text, row, index) => {
            return moment(text).format("YYYY-MM-DD HH:mm");
          },
        },
      ],
    };
  },
  methods: {
    onPageChange(page, pageSize) {
      this.pagination.current = page;
      this.pagination.pageSize = pageSize;
      this.queryList();
    },
    showSizeChange(current, size) {
      console.log("current=", current, "size=", size);
      this.pageSize = size;
      this.queryList();
    },
    changePage(page, pageSize) {
      console.log("page=", page, "pageSize=", pageSize);
      this.queryList();
    },
    init() {
      this.queryList();
    },
    queryList() {
      this.loading = true;
      const that = this;
      otherDeviceList({
        current: that.pagination.current,
        size: that.pagination.pageSize,
        ...that.form,
      })
        .then((res) => {
          const r = res.data;
          if (r.code !== 200) {
            return;
          }
          const data = r.data;
          console.log("API 返回的数据:", r.data.records);
          that.list = data.records || [];
          that.pagination = {
            total: parseInt(data.total),
            current: parseInt(data.current),
            pageSize: parseInt(data.size),
          };
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    addUI() {
      const that = this;
      that.$util.clearObject(that.addUIForm, true);
      that.addUIForm.status = 0;
      that.addUIVisible = true;
    },
    addUIOk() {
      const that = this;
      otherDeviceAdd({ ...that.addUIForm }).then((res) => {
        const r = res.data;
        if (r.code !== 200) {
          return;
        }
        that.$message.success("操作成功", 1.5, () => {
          that.init();
          that.addUIVisible = false;
        });
      });     
    },
    stateChange(checked) {
      this.addUIForm["status"] = checked ? 1 : 0;
    },
    pushStatus(record) {
      const that = this;
      otherDeviceUpdateStatus({
        id: record.id,
        status: record.status == 0 ? 1 : 0,
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
    "addUIForm.uniqueId": (newValue, oldValue) => {},
  },
};
</script>
<style scoped lang="less">
@import "index";
.new-page{
  overflow-x: auto;
  width:100%;  
  }

.search {
  margin-bottom: 54px;
}

.operator {
  margin-bottom: 18px;
}
</style>