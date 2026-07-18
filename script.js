// رابط الـ API الخاص بـ Google Apps Script
const API_URL = "https://script.google.com/macros/s/AKfycbw08fnZ46M8kck6Cq07oVZc65cpxChNvAntrrla_Cm76I_5VlIpcGLRdRg3UJXAX1-j/exec";

// دالة جلب بيانات الطلاب وتحديث لوحة الصدارة
async function loadData() {
    try {
        const response = await fetch(API_URL, { method: "GET", redirect: "follow" });
        let data = await response.json();

        // 1. فرز الطلاب تنازلياً حسب الدرجة (الأعلى درجة أولاً)
        data.sort((a, b) => Number(b.score) - Number(a.score));

        // 2. استثناء: جعل الطالبة Janah Amr في بداية القائمة دائماً
        data.sort((a, b) => {
            if (a.name.toString().trim().toLowerCase() === "janah amr") return -1;
            if (b.name.toString().trim().toLowerCase() === "janah amr") return 1;
            return 0;
        });

        // 3. إعادة تعيين الترتيب الرقمي الصحيح (1، 2، 3...) بعد الفرز
        data.forEach((student, index) => {
            student.rank = index + 1;
        });

        const tableBody = document.getElementById("tableBody");
        tableBody.innerHTML = "";

        // عرض قائمة الطلاب كاملة في الجدول
        data.forEach((student) => {
            tableBody.innerHTML += `
                <tr>
                    <td>${student.rank}</td>
                    <td>${student.name}</td>
                    <td>${student.score}</td>
                </tr>
            `;
        });

        // تحديث منصة التتويج للمراكز الثلاثة الأولى بناءً على الترتيب الجديد
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
