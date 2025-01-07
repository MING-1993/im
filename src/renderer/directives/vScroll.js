const vScroll =  {
  mounted: (el, binding) => {
    el.addEventListener('scroll', function (event) {
      binding.value(event)
    })
  }
}

export default vScroll

