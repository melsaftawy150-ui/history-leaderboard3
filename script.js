// رابط الـ API الجديد والمباشر بعد التعديل الأخير لضبط الأعمدة
const API_URL = "https://script.google.com/macros/s/AKfycbyTGWbMNgZ5BslCRV-viQ89fen9Gj6AKKF4a9lqcV_MuIN9QrEO-TlSC0BqEHK6uprz/exec";

// دالة جلب بيانات الطلاب وتحديث لوحة الصدارة
async function loadData() {
    try {
        const response = await fetch(API_URL, { method: "GET", redirect: "follow" });
        const data = await response.json();

        const tableBody = document.getElementById("tableBody");
        tableBody.innerHTML = "";

        // عرض قائمة الطلاب كاملة في الجدول بالترتيب المنضبط
        data.forEach((student) => {
            tableBody.innerHTML += `
                <tr>
                    <td>${student.rank}</td>
                    <td>${student.name}</td>
                    <td>${student.score}</td>
                </tr>
            `;
        });

        // تحديث منصة التتويج للمراكز الثلاثة الأولى بناءً على البيانات الصحيحة
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
