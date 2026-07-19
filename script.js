// الرابط الجديد الفعال والمحدث الخاص بك بعد الإصدار الجديد
const API_URL = "https://script.google.com/macros/s/AKfycbzRWLV9mtei6FDvviHrNMX6hHfW0iK5Fm5p6NgCOrSo6cgdab-j0VabvAL9l77Qkgks/exec";

async function loadData() {
    try {
        const response = await fetch(API_URL, { method: "GET", redirect: "follow" });
        let students = await response.json();

        // 1. تحديث منصة الأوائل (بناءً على أول 3 صفوف في الشيت مباشرة)
        if (students.length >= 1) {
            document.getElementById("firstName").textContent = students[0].name;
            document.getElementById("firstScore").textContent = students[0].score;
        }
        if (students.length >= 2) {
            document.getElementById("secondName").textContent = students[1].name;
            document.getElementById("secondScore").textContent = students[1].score;
        }
        if (students.length >= 3) {
            document.getElementById("thirdName").textContent = students[2].name;
            document.getElementById("thirdScore").textContent = students[2].score;
        }

        // 2. بناء الجدول بنفس ترتيب الشيت تماماً بدون أي فلسفة فرز تقلب الدرجات
        const tableBody = document.getElementById("tableBody");
        if (tableBody) {
            tableBody.innerHTML = "";
            students.forEach((student, index) => {
                tableBody.innerHTML += `
                    <tr>
                        <td><span class="rank-badge">${index + 1}</span></td>
                        <td style="font-weight: 600;">${student.name}</td>
                        <td style="color: #ffd700; font-weight: bold;">${student.score}</td>
                    </tr>
                `;
            });
        }

    } catch (error) {
        console.error("خطأ في جلب البيانات:", error);
    }
}

// كود البحث الفوري الذكي
const searchInput = document.getElementById("search");
if (searchInput) {
    searchInput.addEventListener("input", function () {
        const value = this.value.toLowerCase().trim();
        document.querySelectorAll("#tableBody tr").forEach(row => {
            row.style.display = row.innerText.toLowerCase().includes(value) ? "" : "none";
        });
    });
}

// التشغيل التلقائي الفوري والتحديث كل دقيقة
loadData();
setInterval(loadData, 60000);
