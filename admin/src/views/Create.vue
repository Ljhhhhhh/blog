<template>
  <div class="container">
    <el-form>
      <el-form-item label="标题">
        <el-input v-model="title" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="简介">
        <el-input type="textarea" :rows="2" placeholder="请输入简介" v-model="intro">
        </el-input>
      </el-form-item>
      <p>文章详情</p>
      <!-- <tinymce :height="400" v-model="content" /> -->
      <el-row>
        <el-col>
          <mavon-editor ref="mavon" v-model="content" :navigation="true" :toolbars="toolbars" @imgAdd="$imgAdd"></mavon-editor>
        </el-col>
      </el-row>
    </el-form>
    <div class="category">
      <el-form>
        <el-col :span="6">
          <el-form-item label="文章标签">
            <el-select v-model="articleTags" multiple filterable allow-create default-first-option placeholder="请选择文章标签">
              <el-option v-for="item in tags" :key="item._id" :label="item.name" :value="item.name">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="文章分类">
            <el-select v-model="articleCate" filterable allow-create default-first-option placeholder="请选择文章标签">
              <el-option v-for="item in categorys" :key="item._id" :label="item.name" :value="item.name">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-form>
      <el-button type="primary" @click="submit" class="btn">{{this.id ? '更新文章' : '发布文章'}}</el-button>
      <el-button type="info" @click="$router.back()" class="btn">取消</el-button>
    </div>
    <div class="submit">
    </div>
  </div>
</template>

<script>
  import request from '@/utils/request';
  import {
    mavonEditor
  } from 'mavon-editor';
  import 'mavon-editor/dist/css/index.css';

  export default {
    name: 'Create',
    components: {
      mavonEditor
    },
    data() {
      return {
        id: null,
        title: '',
        intro: '',
        content: '',
        tags: [],
        articleTags: [],
        categorys: [],
        articleCate: '',
        markdownContent: '',
        toolbars: {
          header: true, // 标题
          underline: true, // 下划线
          strikethrough: true, // 中划线
          mark: true, // 标记
          superscript: true, // 上角标
          subscript: true, // 下角标
          quote: true, // 引用
          ol: true, // 有序列表
          ul: true, // 无序列表
          link: true, // 链接
          imagelink: true, // 图片链接
          code: true, // code
          table: true, // 表格
          fullscreen: true, // 全屏编辑
          readmodel: true, // 沉浸式阅读
          htmlcode: true, // 展示html源码
          help: true, // 帮助
          /* 1.3.5 */
          undo: true, // 上一步
          redo: true, // 下一步
          trash: true, // 清空
          save: true, // 保存（触发events中的save事件）
          /* 1.4.2 */
          navigation: true, // 导航目录
          subfield: true, // 单双栏模式
          preview: true, // 预览
        }
      }
    },
    created() {
      if (this.$route.query.id) {
        this.id = this.$route.query.id
        this.getDetail()
      }
      this.getTags();
      this.getCategory();
    },
    methods: {
      $imgAdd(pos, $file) {
        const formData = new FormData()
        formData.append('file', $file)
        request({
          url: '/upload',
          method: 'post',
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data'
          },
        }).then(res => {
          this.$refs.mavon.$img2Url(pos, res.url)
        })
      },
      submit() {
        if (!this.title) {
          this.$message({
            message: '请填写标题',
            type: 'error'
          });
          return;
        }
        if (!this.intro) {
          this.$message({
            message: '请填写简介',
            type: 'error'
          });
          return;
        }
        if (!this.content) {
          this.$message({
            message: '请填写文章详情',
            type: 'error'
          });
          return;
        }
        if (!this.articleTags.length) {
          this.$message({
            message: '请选择标签',
            type: 'error'
          });
          return;
        }
        if (!this.articleCate) {
          this.$message({
            message: '请选择分类',
            type: 'error'
          });
          return;
        }
        const data = {
          title: this.title,
          intro: this.intro,
          // content: this.content,
          content: this.content,
          tags: this.articleTags,
          category: this.articleCate
        }
        if (this.id) {
          data.id = this.id
        }
        request({
          url: '/handleArticle',
          method: 'post',
          data,
        }).then(res => {
          if (res.code === 0) {
            this.$message({
              message: '发布成功',
              type: 'success'
            });
            this.$router.push({
              name: 'home'
            })
          } else {
            this.$message({
              message: '发布失败，请检查',
              type: 'error'
            });
          }
        })
      },
      getDetail() {
        request({
          url: `/articles/${this.id}`,
          method: 'post'
        }).then(res => {
          const data = res.data;
          this.title = data.title;
          this.intro = data.intro;
          this.content = data.content;
          this.articleTags = data.tags;
          this.articleCate = data.category;
        })
      },
      getTags() {
        request({
          url: '/tags',
          method: 'get',
        }).then(res => {
          this.tags = res.tags
        })
      },
      getCategory() {
        request({
          url: '/categorys',
          method: 'get',
        }).then(res => {
          this.categorys = res.categorys
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  .v-note-wrapper{
    min-height: 500px;
  }
  .category {
    margin: 30px 0;
  }
</style>