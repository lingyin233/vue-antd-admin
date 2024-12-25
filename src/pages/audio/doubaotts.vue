<template>
  <div class="new-page" :style="`min-height: ${pageMinHeight}px`">
    <a-card title="语音合成">
      <a-form>
        <a-form-item label="发音人文档" :labelCol="{ span: 7 }" :wrapperCol="{ span: 10 }">
          <span class="ant-form-text">
            https://www.volcengine.com/docs/6561/97465
          </span>
        </a-form-item>
        <a-form-item name="voiceType" label="发音人" :labelCol="{ span: 7 }" :wrapperCol="{ span: 10 }">
          <a-select show-search v-model:value="updateUIForm['voiceType']" :options="options" 
          @search="v => onChangeSelect(v)" @blur="v => onGetValue(v)">
          </a-select>
        </a-form-item>
        <a-form-item name="text" label="内容" :labelCol="{ span: 7 }" :wrapperCol="{ span: 10 }">
          <a-textarea v-model:value="updateUIForm['text']"></a-textarea>
        </a-form-item>
        <a-form-item name="speedRatio" label="语速" :labelCol="{ span: 7 }" :wrapperCol="{ span: 10 }">
          <a-slider v-model:value="updateUIForm['speedRatio']" :min="0.8" :max="2" />
        </a-form-item>
        <a-form-item name="volumeRatio" label="音量" :labelCol="{ span: 7 }" :wrapperCol="{ span: 10 }">
          <a-slider v-model:value="updateUIForm['volumeRatio']" :min="0.8" :max="2" />
        </a-form-item>
        <a-form-item name="pitchRatio" label="音高" :labelCol="{ span: 7 }" :wrapperCol="{ span: 10 }">
          <a-slider v-model:value="updateUIForm['pitchRatio']" :min="0.8" :max="2" />
        </a-form-item>
        <a-form-item name="language" label="语言" :labelCol="{ span: 7 }" :wrapperCol="{ span: 10 }">
          <a-input v-model:value="updateUIForm['language']"></a-input>
        </a-form-item>
        <a-form-item name="data" label="试听" :labelCol="{ span: 7 }" :wrapperCol="{ span: 10 }">
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
import { tts } from '@/services/doubao';
import { Modal } from 'ant-design-vue';
import moment from 'moment';
export default {
  name: 'doubao_tts',
  components: { StandardTable },
  data() {
    return {
      updateUIForm: {
        voiceType: 'zh_female_tianmeixiaoyuan_moon_bigtts',
        text: '',
        speedRatio: 1.0,
        volumeRatio: 1.0,
        pitchRatio: 1.0,
        language: 'cn'
      },
      dataurl: '',
      options: []
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
      that.updateUIForm['voiceType'] = value;
      console.log('onChangeSelect:', value);
    },
    onGetValue(value) {
      const that = this;
      that.updateUIForm['voiceType'] = value;
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