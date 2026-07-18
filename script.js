// رابط الـ API المباشر والجاهز
const API_URL = "https://script.google.com/macros/s/AKfycbyTGWbMNgZ5BslCRV-viQ89fen9Gj6AKKF4a9lqcV_MuIN9QrEO-TlSC0BqEHK6uprz/exec";

async function loadData() {
    try {
        const response = await fetch(API_URL, { method: "GET", redirect: "follow" });
        const data = await response.json();

        const tableBody = document.getElementById("tableBody");
        tableBody.innerHTML = "";

        // عرض قائمة الطلاب في الجدول بالترتيب المنضبط (الترتيب ثم الاسم ثم الدرجة)
        data.forEach((student) => {
            tableBody.innerHTML += `
                <tr>
                    <td>${student.rank}</td>
                    <td>${student.name}</td>
                    <td>${student.score}</td>
                </tr>
            `;
        });

        // تحديث منصة التتويج للمراكز الثلاثة الأولى بشكل صحيح
        if (data.length >= 1) {
            document.getElementById("firstName").textContent = data[0].name;
            document.getElementById("firstScore").textContent = data[0].score + " درجة";
        }
        if (data.length >= 2) {
            document.getElementById("secondName").textContent = data[1].name;
            document.getElementById("secondScore").textContent = data[1].score + " درجة";
        }
        if (data.length >= 3) {
            document.getElementById("thirdName").textContent = data[2].name;
            document.getElementById("thirdScore").textContent = data[2].score + " census";
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

// تشغيل جلب البيانات فوراً
loadData();
// تحديث تلقائي كل 30 ثانية
setInterval(loadData, 30000);
