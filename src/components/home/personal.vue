<template>
  <div class="info bg-slate-100 dark:bg-cyan-800">
    <n-flex>
      <div class="creator-cover">
        <NuxtImg style="width: 100%;border-radius: 10px" fit="cover" loading="lazy" format="webp" src="https://cdn.qiniu.jwyt.cloud/common/creator-cover-8.png" alt="creator-cover" />
      </div>
      <div class="creator-wrapper">
        <div class="creator-info-wrapper">
          <div class="creator-info">
            <div class="avatar box-64">
              <a>
                <NuxtImg style="width: 58px;height: 58px;border-radius: 50%;border: 3px solid #ffffff" fit="cover" loading="lazy" format="webp" src="https://cdn.qiniu.jwyt.cloud/common/creator-cover-8.png" alt="avatar" />
                <span class="verified">
                  <svg class="crumina-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#0b4be0" d="m10.562 15.908l6.396-6.396l-.708-.708l-5.688 5.688l-2.85-2.85l-.708.708zM12.003 21q-1.866 0-3.51-.708q-1.643-.709-2.859-1.924t-1.925-2.856T3 12.003t.709-3.51Q4.417 6.85 5.63 5.634t2.857-1.925T11.997 3t3.51.709q1.643.708 2.859 1.922t1.925 2.857t.709 3.509t-.708 3.51t-1.924 2.859t-2.856 1.925t-3.509.709"/></svg>
                </span>
              </a>
            </div>
          </div>
        </div>
        <div class="title">
          江晚正愁余
        </div>
        <div class="follow-me">
          <n-button round color="#8a2be2">
            点个赞
          </n-button>
        </div>
      </div>
    </n-flex>
  </div>
</template>

<script>

</script>

<style scoped lang="scss">
.info{
  width:100%;
  border-radius: 10px;
  .creator-cover{
    width:100%;
    border-radius: 10px;
  }
  .follow-me{
    position: absolute;
    top: -25px;
    right: -170px;
    z-index: 1;
  }
   .creator-wrapper{
     padding: 0 30px 30px;
     position: relative;
     .creator-info-wrapper {
       margin-top: -45px;
       position: relative;
        .creator-info {
         //margin-bottom: 30px;
       }
       .avatar {
         margin-bottom: 10px;
         display: flex;
         justify-content: center;
         align-items: center;
         background: $cryptoki-gradient;
       }
       .box-64{
         width: 80px;
         height: 80px;
         border: 8px solid $body-background;
         border-radius: 50%;
       }
       .verified{
         position: absolute;
         right: 5px;
         bottom: 5px;
         .crumina-icon{
           border: 1px solid $body-background;
           fill: $contrast-text-color;
           background-color: #ffffff;
           border-radius: 100%;
         }
       }
       .title{
         font-size: 20px;
       }
     }
   }
}

</style>
