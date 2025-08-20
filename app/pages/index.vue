<template>
  <div class="flex justify-center relative">
    <div class="w-100 absolute">
      <svg class=" " xmlns="http://www.w3.org/2000/svg" viewBox="-35 0 70 20">
        <path :d="svgPath" fill="#000000" />
      </svg>
    </div>
    <div class="border absolute w-[70px]">

    </div>


  </div>
</template>

<script setup lang="ts">
import { animate } from 'animejs';
let p1 = ref(32);
let p2 = ref(27);
let p3 = ref(5);
let p4 = ref(15);
let p5 = ref(17);
let p6 = ref(0);

let points = ref({
  p1: 32,
  p2: 27,
  p3: 5,
  p4: 15,
  p5: 17,
  p6: 0,
})

// let p1 = ref(18);  // 上面两侧尖角的距离
// let p2 = ref(15);  // 中间的长度
// let p3 = ref(2);   // 圆角的曲率
// let p4 = ref(5);  // 下面两侧的尖角距离
// let p5 = ref(8);  // 高度
// let p6 = ref(0);  // 顶部的距离


const svgPath = computed(() => {
  return `
M -${points.value.p1} ${points.value.p6} 
C -${points.value.p2} ${points.value.p6} -${points.value.p2} ${points.value.p3} -${points.value.p2} ${points.value.p3} 
C -${points.value.p2} ${points.value.p5} -${points.value.p2} ${points.value.p5} -${points.value.p4} ${points.value.p5} 
C -${points.value.p3} ${points.value.p5} ${points.value.p3} ${points.value.p5} ${points.value.p4} ${points.value.p5} 
C ${points.value.p2} ${points.value.p5} ${points.value.p2} ${points.value.p5} ${points.value.p2} ${points.value.p3} 
C ${points.value.p2} ${points.value.p3} ${points.value.p2} ${points.value.p6} ${points.value.p1} ${points.value.p6} 
Z
`
});
definePageMeta({
  layout: 'main-window'
})
let flag = true;
onMounted(() => {

  setInterval(() => {
    if (flag) ani1();
    else ani2();
    flag = !flag;
  }, 3000);
})
function ani1() {
  animate(points.value, {
    duration: 600,
    delay: 1000,
    ease: 'inOutBack(3.90158)',
    p1: 32,
    p2: 27,
    p3: 5,
    p4: 15,
    p5: 17,
    p6: 0,
  })
}
function ani2() {
  animate(points.value, {
    duration: 600,
    delay: 1000,
    ease: 'inOutBack(3.90158)',
    p1: 18,
    p2: 15,
    p3: 2,
    p4: 8,
    p5: 8,
    p6: 0,
  })
}
</script>
