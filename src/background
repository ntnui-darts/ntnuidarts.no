<template>
  <div class="youtube-background">
    <iframe 
      id="bg-video"
      :src="videoUrl"
      frameborder="0"
      allow="autoplay; fullscreen"
      allowfullscreen
    ></iframe>
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    videoId: {
      type: String,
      required: true,
    },
  },
  computed: {
    videoUrl() {
      return `https://www.youtube.com/embed/${this.videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${this.videoId}&iv_load_policy=3&modestbranding=1&showinfo=0&rel=0`;
    },
  },
}
</script>

<style scoped>
.youtube-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: -1;
}

#iframe {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100vw;
  height: 100vh;
  transform: translate(-50%, -50%);
  background: transparent;
}
</style>
