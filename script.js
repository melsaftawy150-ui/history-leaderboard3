// الرابط الصحيح والمباشر الخاص بك 100%
const API_URL = "https://script.google.com/macros/s/AKfycbw08fnZ46M8kck6Cq07oVZc65cpxChNvAntrrla_Cm76I_5VlIpcGLRdRg3UJXAX1-j/exec";

async function loadData() {
    try {
        const response = await fetch(API_URL, { method: "GET", redirect: "follow" });
        const data = await response.json();

        const tableBody = document.getElementById("tableBody");
        tableBody.innerHTML = "";

        // عرض قائمة الطلاب في الجدول بالترتيب الصحيح (الترتيب ثم الاسم ثم الدرجة)
        data.forEach((student) => {
            tableBody.innerHTML += `
                <tr>
                    <td>${student.rank}</td>
                    <td>${student.name}</td>
                    <td>${student.score}</td>
                </tr>
            `;
        });

        // تحديث منصة التتويج بالأسماء والدرجات الحقيقية من الشيت مباشرة
        if (data.length >= 1) {
            document.getElementById("firstName").textContent = data[0].name;
            document.getElementById("firstScore").textContent = data[0].score;
        }
        if (data.length >= 2) {
            document.getElementById("secondName").textContent = data[1].name;
            document.getElementById("secondScore").textContent = data[1].score;
        }
        if (data.length >= 3) {
            document.getElementById("thirdName").textContent = data[2].name;
            document.getElementById("thirdScore").textContent = data[2].score;
        }
    } catch (error) {
        console.error("خطأ في جلب البيانات:", error);
    }
}

// كود البحث الذكي
document.getElementById("search").addEventListener("input", function () {
    const value = this.value.toLowerCase();
    document.querySelectorAll("#tableBody tr").forEach(row => {
        row.style.display = row.innerText.toLowerCase().includes(value) ? "" : "none";
    });
});

// تشغيل الدالة فوراً عند تحميل الصفحة
loadData();
// تحديث تلقائي كل 30 ثانية
setInterval(loadData, 30000);
