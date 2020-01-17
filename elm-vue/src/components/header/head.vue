<template>
  <header id='head_top'>
    <slot name='logo'></slot>
    <slot name='search'></slot>
    <section class='title_head ellipsis' v-if="headTitle">
      <span class='title_text'>{{headTitle}}</span>
    </section>
    <slot name="edit"></slot>
    <slot name="msite-title"></slot>
    <slot name="changecity"></slot>
    <slot name="changeLogin"></slot>
  </header>
</template>

<script>
  import {} from ''
</script>

<style lang='sass' scope>

</style>
