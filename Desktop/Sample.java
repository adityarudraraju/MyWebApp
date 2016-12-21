import java.io.*;
import java.util.*;
public class Sample{
	private static int N;
	
	public static void main(String args[]){
		Scanner scanner = new Scanner(System.in);
		System.out.print("Enter No of Integers : ");
		int n;
		n = scanner.nextInt();
		int[] arr = new int[n];
		System.out.println("Enter "+n+" Integers");
		
		for(int i=0;i<n;i++){
			arr[i] = scanner.nextInt();
		}
		sort(arr);
		System.out.println("Displaying Array Data");
		for(int i=0;i<n;i++){
			System.out.print(arr[i]+" ");
		}
	}
	
	public static void sort(int[] arr){
		heapify(arr);
		for(int i = N;i > 0;i--){
			swap(arr,0,i);
			N = N-1;
			maxHeap(arr, 0);
		}
	}
	
	public static void heapify(int[] a){
		N = a.length - 1;
		for(int i = N/2;i >= 0;i--)
			maxHeap(a, i);
	}
	
	public static void maxHeap(int[] a,int i){
		System.out.println("i="+i+"&&N="+N);
		int left = 2 * i;
		int right = (2 * i) + 1;
		int max = i;
		
		if(left <= N && a[left] > a[i]){
			System.out.println("a[Left]="+a[left]+"&&a[i]="+a[i]);
			max = left;
		}
		if(right <= N && a[right] > a[max]){
			System.out.println("&&a[right]="+a[right]);
			max = right;
		}
		if(max != i){
			swap(a,i,max);
			maxHeap(a,max);
		}
		for(int j=0;j<a.length;j++){
			System.out.print(a[j]+" ");
		}
		System.out.println();
	}
	
	public static void swap(int[] a,int i,int j){
		int temp = a[i];
		a[i] = a[j];
		a[j] = temp;
	}
}