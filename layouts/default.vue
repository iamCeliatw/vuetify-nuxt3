<script lang="ts" setup></script>

<template>
  <v-layout class="rounded rounded-md">
    <v-app-bar title="Vuetify"></v-app-bar>
      <v-navigation-drawer>
        <v-list-item title="My playground" subtitle="dashboard"></v-list-item>
        <v-divider></v-divider>
        <v-list-item href="/admin/posts" title="posts"></v-list-item>
        <v-list-item href="/test" title="account"></v-list-item>
        <v-list-item href="/test" title="settings"></v-list-item>
      </v-navigation-drawer>    
    <v-main class="d-flex align-center justify-center">
      <slot></slot>
    </v-main>
  </v-layout>
</template>

<style scoped></style>
