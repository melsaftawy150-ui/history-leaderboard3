// رابط الـ API الجديد والمباشر من Google Apps Script
const API_URL = "https://script.google.com/macros/s/AKfycbw08fnZ46M8kck6Cq07oVZc65cpxChNvAntrrla_Cm76I_5VlIpcGLRdRg3UJXAX1-j/exec";

// دالة جلب بيانات الطلاب وتحديث لوحة الصدارة
async function loadData() {
    try {
        // طلب البيانات مع تفعيل خاصية اتباع إعادة التوجيه (redirect: "follow") لتجنب مشاكل جوجل
        const response = await fetch(API_URL, { method: "GET", redirect: "follow" });
        const data = await response.json();

        const tableBody = document.getElementById("tableBody");
        tableBody.innerHTML = "";

        // عرض قائمة الطلاب كاملة في الجدول
        data.forEach((student, index) => {
            tableBody.innerHTML += `
                <tr>
                    <td>${student.rank || index + 1}</td>
                    <td>${student.name}</td>
                    <td>${student.score}</td>
                </tr>
            `;
        });

        // تحديث منصة التتويج (المراكز الثلاثة الأولى)
        if (data.length >= 3) {
            document.getElementById("firstName").textContent = data[0].name;
            document.getElementById("firstScore").textContent = data[0].score;

            document.getElementById("secondName").textContent = data[1].name;
            document.getElementById("secondScore").textContent = data[1].score;

            document.getElementById("thirdName").textContent = data[2].name;
            document.getElementById("thirdScore").textContent = data[2].score;
        }
    } catch (error) {
        console.error("خطأ في جلب بيانات الطلاب من جوجل:", error);
    }
}

// كود البحث الذكي في الجدول
document.getElementById("search").addEventListener("input", function () {
    const value = this.value.toLowerCase();

    document.querySelectorAll("#tableBody tr").forEach(row => {
        row.style.display = row.innerText.toLowerCase().includes(value)
            ? ""
            : "none";
    });
});

// تشغيل الدالة فور تحميل الصفحة
loadData();

// تحديث البيانات تلقائياً كل 30 ثانية
setInterval(loadData, 30000);
