<template>
  <div class="background-video">
    <!-- Add your video embedding code here -->
    <iframe width="100%" height="100%" 
            src="https://www.youtube.com/embed/_MLGLDGypAE?autoplay=1&mute=1&loop=1&playlist=_MLGLDGypAE"
            frameborder="0" allowfullscreen>
    </iframe>
  </div>
</template>

<script>
export default {
  props: {
    videoId: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>
.background-video {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1; /* Ensure video is behind other content */
}
</style>
