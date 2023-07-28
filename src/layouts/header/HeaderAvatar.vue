<template>
  <div>
    <a-dropdown>
      <div class="header-avatar" style="cursor: pointer">
        <a-avatar class="avatar" size="small" shape="circle" :src="user.avatar" />
        <span class="name">{{ user.name }}</span>
      </div>
      <a-menu :class="['avatar-menu']" slot="overlay">
        <a-menu-item @click="showUpdatePassword()">
          <a-icon type="user" />
          <span>修改密码</span>
        </a-menu-item>
        <!-- <a-menu-item>
        <a-icon type="setting" />
        <span>设置</span>
      </a-menu-item> -->
        <a-menu-divider />
        <a-menu-item @click="logout">
          <a-icon style="margin-right: 8px;" type="poweroff" />
          <span>退出登录</span>
        </a-menu-item>
      </a-menu>
    </a-dropdown>
    <a-modal v-model:visible="updatePasswordVisible" title="修改密码" @ok="updatePassword()">
      <a-form>
        <a-form-item label="密码" :labelCol="{ span: 6 }" :wrapperCol="{ span: 16 }">
          <a-input-password placeholder="请输入" v-model:value="passwd.newpasswd" />
        </a-form-item>
        <a-form-item label="确认密码" :labelCol="{ span: 6 }" :wrapperCol="{ span: 16 }">
          <a-input-password placeholder="请输入" v-model:value="passwd.confirmpasswd" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { Modal } from 'ant-design-vue';
import { logout, updateUserPassword } from '@/services/user';

export default {
  name: 'HeaderAvatar',
  computed: {
    ...mapGetters('account', ['user']),
  },
  data() {
    return {
      updatePasswordVisible: false,
      passwd: {
        newpasswd: '',
        confirmpasswd: ''
      }
    };
  },
  methods: {
    logout() {
      logout().then((res) => {
        if (res.data.code == 200) {
          this.$message.success('退出成功');
        }
        this.$router.push('/login');
      });
    },
    showUpdatePassword() {
      this.updatePasswordVisible = true;
      this.$util.clearObject(this.passwd, true);
    },
    updatePassword() {
      const that = this;
      if (that.passwd.newpasswd == '') {
        that.$message.error('密码不能为空');
        return;
      }
      if (that.passwd.newpasswd !== that.passwd.confirmpasswd) {
        that.$message.error('两次密码不一致');
        return;
      }
      updateUserPassword({ password: that.passwd.newpasswd }).then((res) => {
        const r = res.data;
        if (r.code !== 200) {
          that.$message.error('error code ' + r.code);
          return;
        }
        that.updatePasswordVisible = false;
        that.$message.success('更新密码成功');
        that.$util.clearObject(that.passwd, true);
      });
    },
  }
};
</script>

<style lang="less">
.header-avatar {
  display: inline-flex;

  .avatar,
  .name {
    align-self: center;
  }

  .avatar {
    margin-right: 8px;
  }

  .name {
    font-weight: 500;
  }
}

.avatar-menu {
  width: 150px;
}
</style>
