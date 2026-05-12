<template>
  <div class="new-page" :style="`min-height: ${pageMinHeight}px`">
    <a-card title="语音合成">
      <a-form>
        <a-form-item label="发音人文档" :labelCol="{ span: 7 }" :wrapperCol="{ span: 10 }">
          <span class="ant-form-text">
            https://www.data-baker.com/dev-guide/?sign=30
          </span>
        </a-form-item>
        <a-form-item name="vcn" label="发音人" :labelCol="{ span: 7 }" :wrapperCol="{ span: 10 }">
          <a-select show-search v-model:value="updateUIForm['voice_name']" :options="options" 
          @search="v => onChangeSelect(v)" @blur="v => onGetValue(v)">
          </a-select>
        </a-form-item>
        <a-form-item name="content" label="内容" :labelCol="{ span: 7 }" :wrapperCol="{ span: 10 }">
          <a-textarea v-model:value="updateUIForm['text']"></a-textarea>
        </a-form-item>
        <a-form-item name="speed" label="语速" :labelCol="{ span: 7 }" :wrapperCol="{ span: 10 }">
          <a-slider v-model:value="updateUIForm['speed']" :min="0" :max="9" />
        </a-form-item>
        <a-form-item name="speed" label="音量" :labelCol="{ span: 7 }" :wrapperCol="{ span: 10 }">
          <a-slider v-model:value="updateUIForm['volume']" :min="0" :max="9" />
        </a-form-item>
        <a-form-item name="speed" label="音高" :labelCol="{ span: 7 }" :wrapperCol="{ span: 10 }">
          <a-slider v-model:value="updateUIForm['pitch']" :min="0" :max="9" />
        </a-form-item>
        <a-form-item name="content" label="试听" :labelCol="{ span: 7 }" :wrapperCol="{ span: 10 }">
          <audio :src="dataurl" controls="controls"></audio>
        </a-form-item>
        <a-form-item :wrapperCol="{ span: 10, offset: 7 }">
          <a-button type="primary" @click="compound()">合成</a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>
      
<script>
import StandardTable from '@/components/table/StandardTable';
import { mapState } from 'vuex';
import { tts } from '@/services/baker';
import { Modal } from 'ant-design-vue';
import moment from 'moment';
export default {
  name: 'databaker_tts',
  components: { StandardTable },
  data() {
    return {
      updateUIForm: {
        voice_name: '',
        text: '',
        speed: 5,
        volume: 5,
        pitch: 5
      },
      dataurl: '',
      options: [
        {
          value: 'Jiaojiao',
          label: '娇娇',
        },
        {
          value: 'Guozi',
          label: '果子',
        },
        {
          value: 'Tiantian',
          label: '天天',
        },
      ]
    };
  },
  methods: {
    init() {
      const that = this;
    },
    compound() {
      const that = this;
      tts({...that.updateUIForm}).then((res) => {
        const r = res.data;
        if (r.code != 200) {
          return;
        }
        that.$message.success('合成成功');
        const data = r.data;
        this.dataurl = 'data:audio/mp3;base64,' + data;
      });
    },
    onChangeSelect(value) {
      const that = this;
      that.updateUIForm['voice_name'] = value;
      console.log('onChangeSelect:', value);
    },
    onGetValue(value) {
      const that = this;
      that.updateUIForm['voice_name'] = value;
      console.log('onGetValue:', value);
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