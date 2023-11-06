<template>
  <div class="new-page" :style="`min-height: ${pageMinHeight}px`">
    <a-card title="语音合成">
      <a-form>
        <a-form-item name="vcn" label="发音人" :labelCol="{ span: 7 }" :wrapperCol="{ span: 10 }">
          <a-select v-model:value="updateUIForm['vcn']">
            <a-select-option value="xiaoyan">xiaoyan</a-select-option>
            <a-select-option value="chongchong">chongchong</a-select-option>
            <a-select-option value="x_qige">x_qige</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item name="content" label="内容" :labelCol="{ span: 7 }" :wrapperCol="{ span: 10 }">
          <a-textarea v-model:value="updateUIForm['content']"></a-textarea>
        </a-form-item>
        <a-form-item name="content" label="试听" :labelCol="{ span: 7 }" :wrapperCol="{ span: 10 }">
          <audio :src="dataurl" controls="controls"></audio>
        </a-form-item>
        <a-form-item :wrapperCol="{ span: 10, offset: 7 }">
          <a-button type="primary" @click="hecheng()">合成</a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>
      
<script>
import StandardTable from '@/components/table/StandardTable';
import { mapState } from 'vuex';
import { tts } from '@/services/xf';
import { Modal } from 'ant-design-vue';
import moment from 'moment';
export default {
  name: 'tts',
  components: { StandardTable },
  data() {
    return {
      updateUIForm: {
        vcn: 'xiaoyan',
        content: ''
      },
      dataurl: '',
    };
  },
  methods: {
    init() {
    },
    hecheng() {
      const that = this;
      tts({...that.updateUIForm}).then((res) => {
        const r = res.data;
        if (r.code != 200) {
          return;
        }
        const data = r.data;
        this.dataurl = 'data:audio/mp3;base64,' + data;
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