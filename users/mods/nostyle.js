/* START Absolutely No Styling */
var ansUserstyling = ':not([ href="style/users.css"], [href="style/fonts.css"])';
document.querySelectorAll('style:not([autogen]),[rel="stylesheet"]'+ansUserstyling).forEach((st)=>{
 st.outerHTML = '';
});
document.querySelectorAll('[style]').forEach((st)=>{
	st.setAttribute('style', '');
})
/* END Absolutely No Styling */
